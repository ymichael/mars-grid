#!/usr/bin/env bun

import { addDays } from "date-fns";
import fs from "fs";
import path from "path";
import {
  generateGridPuzzlesFromSeed,
  getGridId,
  getSeedForDate,
} from "../src/lib/grid";

const NUM_DAYS = 300;
const OUTPUT_FILE = path.join(__dirname, "../src/grids.json");

function generateDailyGrids(
  numDays: number,
  existingGrids: Record<string, string>,
): Record<string, string> {
  console.log(`Generating ${numDays} daily puzzles...`);
  const puzzles: Record<string, string> = {};
  const startDate = new Date();
  const existingIds = new Set(Object.values(existingGrids));

  for (let i = 0; i < numDays; i++) {
    const currentDate = addDays(startDate, i);
    const seed = getSeedForDate(currentDate);
    let gridId;
    for (const grid of generateGridPuzzlesFromSeed(seed)) {
      gridId = getGridId(grid);
      if (!existingIds.has(gridId)) {
        puzzles[seed] = gridId;
        existingIds.add(gridId);
        console.log(`Generated unique puzzle for ${seed}: ${gridId}`);
        break;
      }
    }
    if (!gridId) {
      console.error(`Failed to generate a unique puzzle for ${seed}`);
    }
  }
  console.log(`Finished generating ${numDays} unique puzzles.`);
  return puzzles;
}

function updateGridsFile(grids: Record<string, string>): void {
  console.log(`Saving grids to file: ${OUTPUT_FILE}`);
  let existingGrids: Record<string, string> = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    console.log(`Existing file found. Reading current grids...`);
    const fileContent = fs.readFileSync(OUTPUT_FILE, "utf-8");
    existingGrids = JSON.parse(fileContent);
  }
  const updatedGrids = { ...existingGrids, ...grids };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updatedGrids, null, 2));
  console.log(
    `Grids saved to ${OUTPUT_FILE}. Total grids: ${Object.keys(updatedGrids).length}`,
  );
}

function main() {
  let existingGrids: Record<string, string> = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    const fileContent = fs.readFileSync(OUTPUT_FILE, "utf-8");
    existingGrids = JSON.parse(fileContent);
  }
  const grids = generateDailyGrids(NUM_DAYS, existingGrids);
  updateGridsFile(grids);
}

main();
