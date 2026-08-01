import { CircleDotDashed, Leaf, LifeBuoy, Mountain, Route, Waves } from "lucide-react";

export function DivisionIcon({ name, size = 28 }: { name: string; size?: number }) {
  const props = { size, strokeWidth: 1.7, "aria-hidden": true as const };
  if (name === "waves") return <Waves {...props} />;
  if (name === "leaf") return <Leaf {...props} />;
  if (name === "carabiner") return <CircleDotDashed {...props} />;
  if (name === "cave") return <Route {...props} />;
  if (name === "rescue") return <LifeBuoy {...props} />;
  return <Mountain {...props} />;
}
