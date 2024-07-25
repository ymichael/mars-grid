import { generateGridPuzzle, getGridId } from "@/lib/grid";
import { redirect } from "next/navigation";

export default function HomePage() {
  const gridId = getGridId(generateGridPuzzle());
  redirect(`/grid/${gridId}`);
  return null;
}
