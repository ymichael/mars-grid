"use client";

import React, { useMemo, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import { getGridId, Grid as GridType } from "@/lib/grid";
import {
  getRandomSolution,
  isSolution,
  isValidCardForCell,
} from "@/lib/solver";
import { getRuleById } from "@/lib/rules";
import { Button } from "@/components/ui/button";
import { ResponsiveCard } from "./Card";
import { CardSearch } from "@/components/CardSearch";
import { NewGame, DailyPuzzle } from "@/components/NewGame";
import { HowToPlay } from "@/components/HowToPlay";
import { About } from "@/components/About";
import useLocalStorageState from "use-local-storage-state";
import { isValidCardId } from "@/lib/allCards";

type SelectedCardIds = (string | null)[];

function useGridSolutions(
  gridId: string,
): [SelectedCardIds, (newSelectedCardIds: SelectedCardIds) => void] {
  const [gridSolutions, setGridSolutions] = useLocalStorageState<
    Record<string, SelectedCardIds>
  >("gridSolutions", { defaultValue: {} });
  const [mostRecentGridIds, setMostRecentGridIds] = useLocalStorageState<
    string[]
  >("mostRecentGridIds", { defaultValue: [] });
  const updateGridSolution = useCallback(
    (newSelectedCardIds: SelectedCardIds) => {
      const updatedMostRecentGridIds = [
        gridId,
        ...mostRecentGridIds.filter((id) => id !== gridId),
      ];
      setGridSolutions((prevSolutions) => {
        const updatedSolutions = {
          ...prevSolutions,
          [gridId]: newSelectedCardIds,
        };
        if (updatedMostRecentGridIds.length > 50) {
          const solutionsToKeep: Record<string, SelectedCardIds> = {};
          for (const id of updatedMostRecentGridIds) {
            if (updatedSolutions[id]) {
              solutionsToKeep[id] = updatedSolutions[id];
            }
          }
          return solutionsToKeep;
        }
        return updatedSolutions;
      });
      setMostRecentGridIds(updatedMostRecentGridIds.slice(0, 50));
    },
    [gridId, mostRecentGridIds, setGridSolutions, setMostRecentGridIds],
  );
  return [gridSolutions[gridId] || Array(9).fill(null), updateGridSolution];
}

export function Grid({ grid }: { grid: GridType }) {
  const gridId = getGridId(grid);
  const [selectedCardIds, setSelectedCardIds] = useGridSolutions(gridId);
  const [solutionCardIds, setSolutionCardIds] = useState<SelectedCardIds>(() =>
    Array.from({ length: 9 }, () => null),
  );
  const [hideCongrats, setHideCongrats] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [currentCellIdx, setCurrentCellIdx] = useState<number | null>(null);

  const onCellClick = (cellIdx: number) => {
    if (showSolution) {
      return;
    }
    setCurrentCellIdx(cellIdx);
    setIsSearchActive(true);
  };
  const onCardSelect = (selectedCardId: string | null) => {
    if (currentCellIdx === null) {
      return;
    }
    if (selectedCardId && !isValidCardId(selectedCardId)) {
      return;
    }
    setSelectedCardIds(
      selectedCardIds.map((cardId, idx) =>
        idx === currentCellIdx ? selectedCardId : cardId,
      ),
    );
    setCurrentCellIdx(null);
    setIsSearchActive(false);
  };
  const cardIdsToDisplay = showSolution ? solutionCardIds : selectedCardIds;
  const isSolved = useMemo(() => {
    return isSolution(grid, selectedCardIds);
  }, [selectedCardIds, grid]);
  return (
    <div className="flex flex-col relative">
      <div
        className="grid grid-cols-4 grid-rows-4 gap-2 p-2"
        style={{
          gridTemplateRows: "auto",
        }}
      >
        <div></div> {/* Empty top-left corner */}
        <GridLabel type="col" ruleId={grid.ruleColumns[0]} />
        <GridLabel type="col" ruleId={grid.ruleColumns[1]} />
        <GridLabel type="col" ruleId={grid.ruleColumns[2]} />
        <GridLabel type="row" ruleId={grid.ruleRows[0]} />
        <GridCell
          grid={grid}
          cellIdx={0}
          selectedCardIds={cardIdsToDisplay}
          onClick={() => onCellClick(0)}
        />
        <GridCell
          grid={grid}
          cellIdx={1}
          selectedCardIds={cardIdsToDisplay}
          onClick={() => onCellClick(1)}
        />
        <GridCell
          grid={grid}
          cellIdx={2}
          selectedCardIds={cardIdsToDisplay}
          onClick={() => onCellClick(2)}
        />
        <GridLabel type="row" ruleId={grid.ruleRows[1]} />
        <GridCell
          grid={grid}
          cellIdx={3}
          selectedCardIds={cardIdsToDisplay}
          onClick={() => onCellClick(3)}
        />
        <GridCell
          grid={grid}
          cellIdx={4}
          selectedCardIds={cardIdsToDisplay}
          onClick={() => onCellClick(4)}
        />
        <GridCell
          grid={grid}
          cellIdx={5}
          selectedCardIds={cardIdsToDisplay}
          onClick={() => onCellClick(5)}
        />
        <GridLabel type="row" ruleId={grid.ruleRows[2]} />
        <GridCell
          grid={grid}
          cellIdx={6}
          selectedCardIds={cardIdsToDisplay}
          onClick={() => onCellClick(6)}
        />
        <GridCell
          grid={grid}
          cellIdx={7}
          selectedCardIds={cardIdsToDisplay}
          onClick={() => onCellClick(7)}
        />
        <GridCell
          grid={grid}
          cellIdx={8}
          selectedCardIds={cardIdsToDisplay}
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
                setSolutionCardIds(getRandomSolution(grid));
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
        <DailyPuzzle />
        <NewGame />
      </div>
      <CardSearch
        open={isSearchActive}
        setOpen={setIsSearchActive}
        selectedCardId={
          typeof currentCellIdx === "number"
            ? selectedCardIds[currentCellIdx]
            : null
        }
        onSelectCard={onCardSelect}
      />
    </div>
  );
}

function GridCell({
  grid,
  cellIdx,
  selectedCardIds,
  onClick,
}: {
  grid: GridType;
  cellIdx: number;
  selectedCardIds: SelectedCardIds;
  onClick: () => void;
}) {
  const cardId = selectedCardIds[cellIdx];
  const isValid = useMemo(() => {
    // Check if unique
    if (cardId && selectedCardIds.filter((id) => id === cardId).length > 1) {
      return false;
    }
    return isValidCardForCell(grid, cellIdx, cardId);
  }, [grid, cardId, selectedCardIds, cellIdx]);

  if (!cardId) {
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
        "relative w-[150px] aspect-[15/18] max-w-full flex items-center justify-center rounded-md hover:border hover:border-2 hover:border-blue-500 hover:rounded-md cursor-pointer border-2 overflow-hidden",
        !isValid && "border-red-500",
      )}
      style={{
        minHeight: "fit-content",
      }}
      data-animation={!isValid ? "error" : undefined}
      onClick={onClick}
    >
      <ResponsiveCard cardId={cardId} />
    </div>
  );
}

function GridLabel({ type, ruleId }: { type: "col" | "row"; ruleId: string }) {
  const rule = getRuleById(ruleId);
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
