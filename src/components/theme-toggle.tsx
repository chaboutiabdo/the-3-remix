import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const options: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "system", icon: Monitor, label: "System" },
  { value: "dark", icon: Moon, label: "Dark" },
];

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, resolvedTheme, toggle } = useTheme();

  if (compact) {
    const Icon = resolvedTheme === "dark" ? Sun : Moon;
    return (
      <button
        onClick={toggle}
        className="rounded-full border border-border/70 bg-card/60 p-2 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft"
        aria-label="Toggle theme"
        title={`Theme: ${theme}`}
      >
        <Icon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-card/60 p-0.5">
      {options.map((o) => {
        const Icon = o.icon;
        const active = theme === o.value;
        return (
          <button
            key={o.value}
            onClick={() => setTheme(o.value)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-all",
              active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
            )}
            aria-label={o.label}
            title={o.label}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
