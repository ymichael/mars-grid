"use client";

import React, { useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  generateGridPuzzle,
  generateGridPuzzleFromSeed,
  getGridId,
} from "@/lib/grid";

export function NewGame() {
  const router = useRouter();
  const startNewGame = () => {
    const gridId = getGridId(generateGridPuzzle());
    router.push(`/grid/${gridId}`);
  };

  return (
    <Button
      size="sm"
      variant="link"
      className="underline font-normal text-xs px-2"
      onClick={startNewGame}
    >
      New Game
    </Button>
  );
}

function useDailyPuzzle(): () => void {
  const router = useRouter();
  return useCallback(() => {
    const today = new Date();
    const seed = format(today, "yyyy-MM-dd");
    const dailyGrid = generateGridPuzzleFromSeed(seed);
    const gridId = getGridId(dailyGrid);
    router.replace(`/grid/${gridId}`);
  }, [router]);
}

export function DailyPuzzle() {
  const dailyPuzzle = useDailyPuzzle();
  return (
    <Button
      size="sm"
      variant="link"
      className="underline font-normal text-xs px-2"
      onClick={dailyPuzzle}
    >
      Today's Grid
    </Button>
  );
}

function DailyPuzzleOnLoadClient() {
  const dailyPuzzle = useDailyPuzzle();
  useEffect(() => {
    dailyPuzzle();
  }, [dailyPuzzle]);
  return null;
}

// Use the client's date to generate the grid
export const DailyPuzzleOnLoad = dynamic(
  () => Promise.resolve(DailyPuzzleOnLoadClient),
  {
    ssr: false,
  },
);
