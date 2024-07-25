"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import {
  Grid as GridType,
  SerializedGrid,
  deserializeGridForClient,
} from "@/lib/grid";
import { getRandomSolution } from "@/lib/solver";
import { Rule } from "@/lib/rules";
import { Card } from "@/lib/allCards";
import { Button } from "@/components/ui/button";
import { ResponsiveCard } from "./Card";
import { CardSearch } from "@/components/CardSearch";
import { NewGame } from "@/components/NewGame";
import { HowToPlay } from "@/components/HowToPlay";
import { About } from "@/components/About";

export function Grid({ serializedGrid }: { serializedGrid: SerializedGrid }) {
  const grid = deserializeGridForClient(serializedGrid);
  const [selectedCards, setSelectedCards] = useState<(Card | null)[]>(() =>
    Array.from({ length: 9 }, () => null)
  );

  const [hideCongrats, setHideCongrats] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionCards, setSolutionCards] = useState<(Card | null)[]>(() =>
    Array.from({ length: 9 }, () => null)
  );
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [currentCellIdx, setCurrentCellIdx] = useState<number | null>(null);

  const onCellClick = (cellIdx: number) => {
    if (showSolution) {
      return;
    }
    setCurrentCellIdx(cellIdx);
    setIsSearchActive(true);
  };
  const onCardSelect = (selectedCard: Card | null) => {
    if (currentCellIdx === null) {
      return;
    }
    if (selectedCard) {
      setSelectedCards(
        selectedCards.map((card, idx) =>
          idx === currentCellIdx ? selectedCard : card
        )
      );
    }
    setCurrentCellIdx(null);
    setIsSearchActive(false);
  };

  const cardsToDisplay = showSolution ? solutionCards : selectedCards;
  const isSolved = useMemo(() => {
    // Check that all selected cards are populated
    if (selectedCards.some((card) => !card)) {
      return false;
    }
    // No duplicates in the grid
    const set = new Set(selectedCards);
    if (set.size !== 9) {
      return false;
    }
    // Make sure that all cards match the rules
    for (let i = 0; i < 9; i++) {
      const card = selectedCards[i]!;
      const rowRule = grid.ruleRows[Math.floor(i / 3)];
      const colRule = grid.ruleColumns[i % 3];
      if (!rowRule.matches(card) || !colRule.matches(card)) {
        return false;
      }
    }
    return true;
  }, [selectedCards, grid]);

  return (
    <div className="flex flex-col relative">
      <div
        className="grid grid-cols-4 grid-rows-4 gap-2 p-2"
        style={{
          gridTemplateRows: "auto",
        }}
      >
        <div></div> {/* Empty top-left corner */}
        <GridLabel type="col" rule={grid.ruleColumns[0]} />
        <GridLabel type="col" rule={grid.ruleColumns[1]} />
        <GridLabel type="col" rule={grid.ruleColumns[2]} />
        <GridLabel type="row" rule={grid.ruleRows[0]} />
        <GridCell
          grid={grid}
          cellIdx={0}
          selectedCards={cardsToDisplay}
          onClick={() => onCellClick(0)}
        />
        <GridCell
          grid={grid}
          cellIdx={1}
          selectedCards={cardsToDisplay}
          onClick={() => onCellClick(1)}
        />
        <GridCell
          grid={grid}
          cellIdx={2}
          selectedCards={cardsToDisplay}
          onClick={() => onCellClick(2)}
        />
        <GridLabel type="row" rule={grid.ruleRows[1]} />
        <GridCell
          grid={grid}
          cellIdx={3}
          selectedCards={cardsToDisplay}
          onClick={() => onCellClick(3)}
        />
        <GridCell
          grid={grid}
          cellIdx={4}
          selectedCards={cardsToDisplay}
          onClick={() => onCellClick(4)}
        />
        <GridCell
          grid={grid}
          cellIdx={5}
          selectedCards={cardsToDisplay}
          onClick={() => onCellClick(5)}
        />
        <GridLabel type="row" rule={grid.ruleRows[2]} />
        <GridCell
          grid={grid}
          cellIdx={6}
          selectedCards={cardsToDisplay}
          onClick={() => onCellClick(6)}
        />
        <GridCell
          grid={grid}
          cellIdx={7}
          selectedCards={cardsToDisplay}
          onClick={() => onCellClick(7)}
        />
        <GridCell
          grid={grid}
          cellIdx={8}
          selectedCards={cardsToDisplay}
          onClick={() => onCellClick(8)}
        />
      </div>
      {!hideCongrats && isSolved && (
        <div
          className="absolute bottom-16 left-12 right-12 bg-secondary text-xs text-white p-4 flex justify-between items-center"
          data-animation="wiggle"
        >
          <span>Congratulations! You have solved the grid!</span>
          <Cross1Icon
            className="w-4 h-4 p-0.5 cursor-pointer"
            onClick={() => setHideCongrats(true)}
          />
        </div>
      )}
      <div className="flex justify-center py-4 h-[64px]">
        {isSolved && (
          <>
            <Button
              size="sm"
              className="font-normal text-xs px-2"
              onClick={() => {
                setShowSolution(true);
                setSolutionCards(getRandomSolution(grid));
              }}
            >
              View other solutions
            </Button>
            <Button
              size="sm"
              variant="link"
              className={cn("underline font-normal text-xs px-2", {
                "text-gray-500": !showSolution,
              })}
              onClick={() => {
                setShowSolution(false);
              }}
            >
              {showSolution ? "Your solution" : "Hide solutions"}
            </Button>
          </>
        )}
      </div>
      <div className="fixed bottom-0 right-0 p-4">
        <About />
        <HowToPlay />
        <NewGame />
      </div>
      <CardSearch
        open={isSearchActive}
        setOpen={setIsSearchActive}
        onSelectCard={onCardSelect}
      />
    </div>
  );
}

function GridCell({
  grid,
  cellIdx,
  selectedCards,
  onClick,
}: {
  grid: GridType;
  cellIdx: number;
  selectedCards: (Card | null)[];
  onClick?: () => void;
}) {
  const rowRule = grid.ruleRows[Math.floor(cellIdx / 3)];
  const colRule = grid.ruleColumns[cellIdx % 3];
  const card = selectedCards[cellIdx];

  const isValid = useMemo(() => {
    if (!card) {
      return true;
    }
    if (!rowRule.matches(card) || !colRule.matches(card)) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      // Check for duplicates in the grid
      if (i !== cellIdx && selectedCards[i] === card) {
        return false;
      }
    }
    return true;
  }, [rowRule, colRule, card, cellIdx, selectedCards]);

  if (!card) {
    return (
      <div
        className="w-[150px] aspect-[15/18] max-w-full flex items-center justify-center border rounded-md bg-background hover:border hover:border-2 hover:border-blue-500 hover:rounded-md cursor-pointer"
        onClick={onClick}
      ></div>
    );
  }
  return (
    <div
      className={cn(
        "w-[150px] aspect-[15/18] max-w-full flex items-center justify-center rounded-md hover:border hover:border-2 hover:border-blue-500 hover:rounded-md cursor-pointer border-2",
        !isValid && "border-red-500"
      )}
      style={{
        minHeight: "fit-content",
      }}
      data-animation={!isValid ? "error" : undefined}
      onClick={onClick}
    >
      {card && <ResponsiveCard card={card} />}
    </div>
  );
}

function GridLabel({ type, rule }: { type: "col" | "row"; rule: Rule }) {
  return (
    <div
      className={cn(
        "flex p-2",
        type === "col"
          ? "justify-center text-center items-end"
          : "justify-start items-center",
        "font-bold text-white max-w-[150px]"
      )}
    >
      <p className="md:text-sm text-xs">{rule?.description}</p>
    </div>
  );
}
