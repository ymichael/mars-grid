import { Grid } from "@/components/Grid";
import { generateGridPuzzleFromSeed, serializeGridForClient } from "@/lib/grid";

export default async function GridPage({
  params,
}: {
  params: { gridId: string };
}) {
  const gridId = params.gridId;
  const grid = generateGridPuzzleFromSeed(gridId);
  return (
    <div className="flex w-full justify-center items-center h-screen p-2 overflow-hidden">
      <Grid serializedGrid={serializeGridForClient(grid)} />
    </div>
  );
}
