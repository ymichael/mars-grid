import { Grid } from "@/components/Grid";
import { fromGridId } from "@/lib/grid";

export default async function GridPage({
  params,
}: {
  params: { gridId: string };
}) {
  const decodedGridId = decodeURIComponent(params.gridId);
  const grid = fromGridId(decodedGridId);
  return (
    <div className="flex w-full justify-center items-center h-screen p-2 overflow-hidden">
      <Grid grid={grid} />
    </div>
  );
}
