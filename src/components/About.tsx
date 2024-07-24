import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function About() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="link"
        className="underline font-normal text-xs px-2"
        onClick={() => setIsOpen(true)}
      >
        About
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>About</DialogTitle>
          <DialogDescription className="leading-relaxed">
            <p>
              Welcome to the Terraforming Mars Grid game! This game is currently
              in alpha, and we are actively working on improving it. Your
              feedback is highly appreciated.
            </p>
            <br />
            <p>
              You can find the source code and contribute to the game at this{" "}
              <a
                href="https://github.com/ymichael/mars-grid"
                target="_blank"
                className="underline"
              >
                GitHub repository
              </a>
              . If you have feedback or bug reports, you can also reach us at
              this{" "}
              <a
                href="https://forms.gle/VM1x2Ufd8g9fEBe99"
                target="_blank"
                className="underline"
              >
                form
              </a>
              .
            </p>
            <h2 className="font-bold mt-4">Credits</h2>
            <p>
              Special thanks to the creators and contributors of the{" "}
              <a
                href="https://github.com/terraforming-mars/terraforming-mars"
                target="_blank"
                className="underline"
              >
                Terraforming Mars Online Game
              </a>{" "}
              for all the assets and structured data used here and the OG{" "}
              <a
                href="https://immaculategrid.com"
                target="_blank"
                className="underline"
              >
                Immaculate Grid
              </a>{" "}
              for inspiring the idea behind this game.
            </p>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
