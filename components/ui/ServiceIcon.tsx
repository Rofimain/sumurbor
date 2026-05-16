import {
  Droplets,
  Construction,
  Drill,
  Cog,
  Building2,
  HardHat,
  Layers,
  Pickaxe,
  ShieldCheck,
  Users,
  Clock,
  Award,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Droplets,
  Construction,
  Drill,
  Cog,
  Building2,
  HardHat,
  Layers,
  Pickaxe,
  ShieldCheck,
  Users,
  Clock,
  Award,
};

export function ServiceIcon({
  name,
  className = "h-5 w-5",
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && ICON_MAP[name]) || Drill;
  return <Icon className={className} aria-hidden="true" />;
}

export const SERVICE_ICON_OPTIONS = Object.keys(ICON_MAP);
