"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Grid as GridType,
  SerializedGrid,
  deserializeGridForClient,
} from "@/lib/grid";
// import { getRandomSolution } from "@/lib/solver";
import { Rule } from "@/lib/rules";
import { Card } from "@/lib/allCards";
import { ResponsiveCard } from "./Card";
import { CardSearch } from "@/components/CardSearch";
import { NewGame } from "@/components/NewGame";
import { HowToPlay } from "@/components/HowToPlay";
import { About } from "@/components/About";

export function Grid({ serializedGrid }: { serializedGrid: SerializedGrid }) {
  const grid = deserializeGridForClient(serializedGrid);
  const [selectedCards, setSelectedCards] = useState<(Card | null)[]>(() =>
    Array.from({ length: 9 }, () => null),
  );

  const [showSolution, setShowSolution] = useState(false);
  const [solutionCards, setSolutionCards] = useState<(Card | null)[]>(() =>
    Array.from({ length: 9 }, () => null),
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
          idx === currentCellIdx ? selectedCard : card,
        ),
      );
    }
    setCurrentCellIdx(null);
    setIsSearchActive(false);
  };

  const cardsToDisplay = showSolution ? solutionCards : selectedCards;

  return (
    <div className="flex flex-col">
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
      <div className="flex justify-center pt-12">
        {/* <Button
          size="sm"
          variant="link"
          className="underline font-normal text-xs"
          onClick={() => {
            setShowSolution(true);
            setSolutionCards(getRandomSolution(grid));
          }}
        >
          Show Random solution
        </Button> */}
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
        !isValid && "border-red-500",
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
        "font-bold text-white max-w-[150px]",
      )}
    >
      <p className="md:text-sm text-xs">{rule?.description}</p>
    </div>
  );
}
