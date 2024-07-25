import { generateGridPuzzle, getGridId } from "@/lib/grid";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const gridId = getGridId(generateGridPuzzle());
  return redirect(`/grid/${gridId}`);
}
