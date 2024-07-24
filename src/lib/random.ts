/**
 * Adapted from https://stackoverflow.com/a/47593316
 */
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function sfc32(a: number, b: number, c: number, d: number): RandomFunction {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

export type RandomFunction = () => number;

export function randomFactory(seed: string): RandomFunction {
  const seedFunction = xmur3(seed);
  return sfc32(seedFunction(), seedFunction(), seedFunction(), seedFunction());
}

export const defaultRandom = () => Math.random();

export const randomValue = <T>(
  arr: T[],
  rand: RandomFunction = defaultRandom
): T => {
  return arr[Math.floor(rand() * arr.length)];
};

export const oneInX = (
  x: number,
  rand: RandomFunction = defaultRandom
): boolean => {
  return rand() < 1 / x;
};

export const shuffleInPlace = <T>(
  array: T[],
  rand: RandomFunction = defaultRandom
): T[] => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(rand() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};
