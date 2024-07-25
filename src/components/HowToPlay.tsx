import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function HowToPlay() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("source") === "home") {
      setIsOpen(true);
      urlParams.delete("source");
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      router.replace(newUrl);
    }
  }, [router]);

  return (
    <>
      <Button
        size="sm"
        variant="link"
        className="underline font-normal text-xs px-2"
        onClick={() => setIsOpen(true)}
      >
        How to play
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>How to Play 🧑🏼‍🚀</DialogTitle>
          <DialogDescription className="leading-relaxed">
            <p>
              Welcome to the Terraforming Mars Grid game! The goal of the game
              is to fill the grid with cards that satisfy the restrictions for
              each row and column.
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
    </>
  );
}
