import logo from "@/assets/psyconnect-logo.jpg.asset.json";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="PsyConnect"
      className={cn("h-9 w-9 rounded-xl object-contain bg-white shadow-sm ring-1 ring-border", className)}
    />
  );
}
