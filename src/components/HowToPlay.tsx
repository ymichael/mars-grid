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
          <div className="bg-zinc-900 border-l-4 border-yellow-500 text-zinc-300 p-2 mb-4">
            <p>
              If you are not familiar with the{" "}
              <a
                href="https://boardgamegeek.com/boardgame/167791/terraforming-mars"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terraforming Mars board game
              </a>
              , this game might be challenging to fully understand or
              appreciate.
            </p>
          </div>
          <p>
            Welcome to the Terraforming Mars Immaculate Grid game! Your goal is
            to fill the grid with cards that satisfy the restrictions for each
            row and column.
          </p>
          <ol className="list-decimal list-outside p-2 mx-4 my-2">
            <li>
              The game features a 3x3 grid where each cell must contain a unique
              card.
            </li>
            <li>
              Each row and column has specific restrictions that the cards must
              meet.
            </li>
            <li>
              To select a card, click on a cell to open the card selection menu.
            </li>
            <li>
              Choose a card that fulfills both the row and column restrictions
              for the selected cell.
            </li>
            <li>You win when all cells are filled with valid cards!</li>
          </ol>
          <p>
            You can use project cards, prelude cards, and corporation cards to
            complete the grid. The game includes all cards from the base game,
            as well as the Prelude, Venus, Colonies, and Turmoil expansions.
          </p>
          <br />
          <p>Good luck and enjoy the game!</p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

const HowToPlayDialog = dynamic(() => Promise.resolve(HowToPlayDialogInner), {
  ssr: false,
});
