"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NewGame() {
  const router = useRouter();
  const startNewGame = () => {
    router.push("/grid/random");
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
