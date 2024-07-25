"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { generateGridPuzzle, getGridId } from "@/lib/grid";

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
