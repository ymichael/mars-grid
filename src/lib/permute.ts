export function* permuteArr<T>(arr: T[], n: number): Generator<T[]> {
  if (n === 1) {
    for (let i = 0; i < arr.length; i++) {
      yield [arr[i]];
    }
  } else {
    for (let i = 0; i < arr.length; i++) {
      const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
      for (const perm of permuteArr(remaining, n - 1)) {
        yield [arr[i], ...perm];
      }
    }
  }
}

export function* permuteBins<T>(
  arr: T[][],
  filterChoices: (choices: T[], result: T[]) => Generator<T>,
): Generator<T[]> {
  // Sort by the length of the array so that we consider the smallest bucket first.
  const sortedIndices = arr
    .map((_, index) => index)
    .sort((a, b) => arr[a].length - arr[b].length);
  for (const solution of permuteBinsHelper(
    arr,
    filterChoices,
    sortedIndices,
    [],
  )) {
    const sortedSolution: T[] = new Array(arr.length);
    solution.forEach((value, index) => {
      sortedSolution[sortedIndices[index]] = value;
    });
    yield sortedSolution;
  }
}

function* permuteBinsHelper<T>(
  arr: T[][],
  filterChoices: (choices: T[], result: T[]) => Generator<T>,
  sortedIndices: number[],
  result: T[],
): Generator<T[]> {
  if (result.length === arr.length) {
    yield result;
    return;
  }
  const currentIndex = result.length;
  const currentSortedIndex = sortedIndices[currentIndex];
  const choices = arr[currentSortedIndex];
  for (const choice of filterChoices(choices, result)) {
    const newResult = result.concat([choice]);
    yield* permuteBinsHelper(arr, filterChoices, sortedIndices, newResult);
  }
}

export function* permuteBinsUnique<T>(arr: T[][]): Generator<T[]> {
  yield* permuteBins(arr, function* (choices, result) {
    for (const choice of choices) {
      if (!result.includes(choice)) {
        yield choice;
      }
    }
  });
}
