import {
  Bike,
  CheckCircle,
  CookingPot,
  CupSoda,
  Flame,
  Heart,
  IceCreamBowl,
  LayoutGrid,
  RotateCcw,
  Salad,
  Trash2,
  Utensils,
  Wheat,
  X,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

/* The seed data and the toast API address icons by their kebab-case
   data-lucide name, exactly as the HTML did. This map is the ONLY place that
   translates a name to a component — hyphens to PascalCase, nothing else. */
const ICONS: Record<string, LucideIcon> = {
  bike: Bike,
  'check-circle': CheckCircle,
  'cooking-pot': CookingPot,
  'cup-soda': CupSoda,
  flame: Flame,
  heart: Heart,
  'ice-cream-bowl': IceCreamBowl,
  'layout-grid': LayoutGrid,
  'rotate-ccw': RotateCcw,
  salad: Salad,
  'trash-2': Trash2,
  utensils: Utensils,
  wheat: Wheat,
  x: X,
};

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp {...props} />;
}
