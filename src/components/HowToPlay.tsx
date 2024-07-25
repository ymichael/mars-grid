"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useLocalStorageState from "use-local-storage-state";

export function HowToPlay() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        size="sm"
        variant="link"
        className="underline font-normal text-xs px-2"
        onClick={() => setIsOpen(true)}
      >
        How To Play
      </Button>
      <HowToPlayDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

function HowToPlayDialogInner({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [hasSeenHowToPlay, setHasSeenHowToPlay] = useLocalStorageState(
    "how-to-play-seen",
    { defaultValue: false },
  );
  useEffect(() => {
    if (!hasSeenHowToPlay) {
      onOpenChange(true);
      setHasSeenHowToPlay(true);
    }
  }, [hasSeenHowToPlay, setHasSeenHowToPlay, onOpenChange]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>How to Play 🧑🏼‍🚀</DialogTitle>
        <DialogDescription className="leading-relaxed">
          <p>
            Welcome to the Terraforming Mars Grid game! The goal of the game is
            to fill the grid with cards that satisfy the restrictions for each
            row and column.
          </p>
          <ol className="list-decimal list-outside p-2 mx-4 my-2">
            <li>
              The game consists of a 3x3 grid where each cell must be filled
              with a unique card.
            </li>
            <li>
              Each row and column has unique restrictions that the cards must
              adhere to.
            </li>
            <li>Click on a cell to bring up the card selection menu.</li>
            <li>
              Choose a card that meets the restrictions for both the row and
              column of the selected cell.
            </li>
            <li>
              You win the game when all cells are filled with valid cards!
            </li>
          </ol>
          <p>Good luck and have fun!</p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

const HowToPlayDialog = dynamic(() => Promise.resolve(HowToPlayDialogInner), {
  ssr: false,
});
