// Wires CTA buttons, sidebar items, and bottom nav across the static screens
// so the prototype feels like a single connected app. Loaded by every page.
(function () {
  function currentId() {
    var b = document.body;
    var id = b && b.getAttribute('data-screen-id');
    return id ? String(id) : '';
  }

  var id = currentId();

  // Role inferred from screen id.
  // Patient: 1,2,3,4,5,6   Psychologist: 14,15   Admin: 7,8   Onboarding: 9-13
  var patientIds   = ['1','2','3','4','5','6'];
  var clinicianIds = ['14','15'];
  var adminIds     = ['7','8'];
  var onboardIds   = ['9','10','11','12','13'];

  function role() {
    if (patientIds.indexOf(id)   !== -1) return 'patient';
    if (clinicianIds.indexOf(id) !== -1) return 'clinician';
    if (adminIds.indexOf(id)     !== -1) return 'admin';
    if (onboardIds.indexOf(id)   !== -1) return 'onboarding';
    return 'patient';
  }
  var r = role();

  // Per-role landing screens.
  var roleHome = {
    patient:    '4',  // Patient Dashboard
    clinician:  '14', // Psychologist Dashboard
    admin:      '7',  // Admin Dashboard
    onboarding: '9',  // Onboarding step 1
  };

  // Map of [textIncludes, targetScreenId]. First match wins.
  // Page-specific rules come first; "*" applies on every page after.
  var rules = {
    '1': [
      ['Find a Psychologist', '2'],
      ['Get Started', '9'],
      ['Start your journey', '9'],
      ['How it Works', '2'],
      ['Browse', '2'],
      ['Learn More', '2'],
    ],
    '2': [
      ['Quick Book', '5'],
      ['View Profile', '3'],
      ['Profile', '3'],
      ['Book', '5'],
      ['Filter', '2'],
    ],
    '3': [
      ['Book Session', '5'],
      ['Book a Session', '5'],
      ['Book', '5'],
      ['Message', '6'],
      ['Read All Reviews', '3'],
      ['Back', '2'],
    ],
    '4': [
      ['Book New Session', '2'],
      ['Book Session', '5'],
      ['Quick Book', '5'],
      ['Join Video', '6'],
      ['Join', '6'],
      ['Open Inbox', '6'],
      ['Go to Messenger', '6'],
      ['Messages', '6'],
      ['View All Favorites', '2'],
      ['Find a Psychologist', '2'],
      ['Log Daily', '4'],
    ],
    '5': [
      ['Confirm', '6'],
      ['Pay', '6'],
      ['Continue', '6'],
      ['Cancel', '4'],
      ['Back', '3'],
    ],
    '6': [
      ['End', '4'],
      ['Leave', '4'],
      ['Hang Up', '4'],
      ['Close', '4'],
    ],
    '7': [
      ['View All', '8'],
      ['Verification Queue', '8'],
      ['Pending Review', '8'],
      ['View Audit Log', '7'],
      ['Audit', '7'],
    ],
    '8': [
      ['Review Application', '13'],
      ['Review', '13'],
      ['Quick Preview', '13'],
      ['Approve', '7'],
      ['Reject', '7'],
      ['Back', '7'],
    ],
    '9': [
      ['Continue', '12'],
      ['Next', '12'],
      ['Get Started', '12'],
      ['Begin', '12'],
      ['Save Draft', '9'],
    ],
    '10': [
      ['Continue', '11'],
      ['Next', '11'],
      ['Previous', '12'],
      ['Back', '12'],
      ['Save Draft', '10'],
    ],
    '11': [
      ['Submit', '13'],
      ['Submit Application', '13'],
      ['Edit', '9'],
      ['Previous', '10'],
      ['Back', '10'],
      ['Save Draft', '11'],
    ],
    '12': [
      ['Continue', '10'],
      ['Next', '10'],
      ['Previous', '9'],
      ['Back', '9'],
      ['Save Draft', '12'],
    ],
    '13': [
      ['Go to Dashboard', '14'],
      ['Dashboard', '14'],
      ['Book Session', '4'],
      ['Continue', '14'],
      ['Done', '14'],
    ],
    '14': [
      ['Accept', '6'],
      ['Join', '6'],
      ['Decline', '14'],
      ['Open Inbox', '6'],
      ['Messages', '6'],
      ['View All', '15'],
      ['Manage Availability', '15'],
      ['Availability', '15'],
    ],
    '15': [
      ['Block Time', '15'],
      ['Add New', '15'],
      ['Save', '14'],
      ['Back', '14'],
      ['Dashboard', '14'],
    ],
    '*': [
      ['Register', '9'],
      ['Sign Up', '9'],
      ['Login', '4'],
      ['Sign In', '4'],
      ['Log In', '4'],
      ['Logout', '1'],
      ['Log Out', '1'],
      ['Sign Out', '1'],
    ],
  };

  // Sidebar items (text-based) — used by all role dashboards/secondary pages.
  // Maps label → target by role.
  var sidebarMap = {
    patient: {
      'dashboard': '4', 'home': '4',
      'messages': '6', 'inbox': '6',
      'calendar': '5', 'appointments': '5', 'sessions': '5',
      'profile': '3', 'find': '2', 'search': '2', 'browse': '2',
    },
    clinician: {
      'dashboard': '14', 'home': '14',
      'messages': '6', 'inbox': '6',
      'calendar': '15', 'availability': '15', 'schedule': '15',
      'patients': '14', 'profile': '14',
    },
    admin: {
      'dashboard': '7', 'home': '7',
      'verification': '8', 'queue': '8', 'review': '8',
      'psychologists': '8', 'users': '8',
      'messages': '7', 'profile': '7',
    },
    onboarding: {
      'dashboard': '9', 'home': '9',
    },
  };

  function go(target) {
    if (!target) return;
    var url = '/screens/' + target;
    try { (window.top || window).location.href = url; }
    catch (e) { window.location.href = url; }
  }

  function textOf(el) {
    return (el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function matchRule(text, list) {
    var t = text.toLowerCase();
    for (var i = 0; i < list.length; i++) {
      if (t.indexOf(list[i][0].toLowerCase()) !== -1) return list[i][1];
    }
    return null;
  }

  function wire() {
    var pageRules = (rules[id] || []).concat(rules['*']);

    // Generic CTA buttons.
    document.querySelectorAll('button').forEach(function (b) {
      if (b.__wired) return;
      var t = textOf(b); if (!t) return;
      var target = matchRule(t, pageRules);
      if (target) {
        b.__wired = true;
        b.style.cursor = 'pointer';
        b.addEventListener('click', function (e) { e.preventDefault(); go(target); });
      }
    });

    // Anchor placeholders.
    document.querySelectorAll('a').forEach(function (a) {
      if (a.__wired) return;
      var href = a.getAttribute('href') || '';
      if (href !== '' && href !== '#') return;
      var t = textOf(a);
      var target = matchRule(t, pageRules);
      // Try sidebar map by individual word tokens (icons + label).
      if (!target) {
        var lower = t.toLowerCase();
        var map = sidebarMap[r] || {};
        Object.keys(map).some(function (k) {
          if (lower.indexOf(k) !== -1) { target = map[k]; return true; }
          return false;
        });
      }
      if (target) {
        a.__wired = true;
        a.style.cursor = 'pointer';
        a.addEventListener('click', function (e) { e.preventDefault(); go(target); });
      }
    });

    // Material-icon-only nav links (icon name inside an <a>).
    var iconToTarget = sidebarMap[r] || {};
    document.querySelectorAll('a').forEach(function (a) {
      if (a.__wired) return;
      var href = a.getAttribute('href') || '';
      if (href !== '' && href !== '#') return;
      // Look for material icon spans
      var icons = a.querySelectorAll('.material-icons, .material-symbols-outlined, [class*="material-"]');
      var iconText = '';
      icons.forEach(function (i) { iconText += ' ' + (i.textContent || ''); });
      iconText = iconText.toLowerCase();
      var target = null;
      Object.keys(iconToTarget).some(function (k) {
        if (iconText.indexOf(k) !== -1) { target = iconToTarget[k]; return true; }
        return false;
      });
      // Common icons
      if (!target) {
        if (iconText.indexOf('logout') !== -1) target = '1';
        else if (iconText.indexOf('chat') !== -1 || iconText.indexOf('message') !== -1) target = r === 'admin' ? '7' : '6';
        else if (iconText.indexOf('person') !== -1 || iconText.indexOf('account_circle') !== -1) {
          target = r === 'patient' ? '3' : (r === 'clinician' ? '14' : '7');
        }
      }
      if (target) {
        a.__wired = true;
        a.style.cursor = 'pointer';
        a.addEventListener('click', function (e) { e.preventDefault(); go(target); });
      }
    });
  }

  function addBackPill() {
    if (document.getElementById('__back_pill')) return;
    var el = document.createElement('a');
    el.id = '__back_pill';
    el.href = '/';
    el.target = '_top';
    el.textContent = '← All screens';
    el.style.cssText = [
      'position:fixed','left:12px','bottom:12px','z-index:99999',
      'background:#181c1b','color:#fff','font:500 12px/1 Inter,system-ui,sans-serif',
      'padding:8px 12px','border-radius:999px','text-decoration:none',
      'box-shadow:0 4px 12px rgba(0,0,0,0.25)','opacity:0.85'
    ].join(';');
    document.body.appendChild(el);
  }

  function boot() { wire(); addBackPill(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
