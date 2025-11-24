import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, beginSlide, chain, useRandom } from '@motion-canvas/core';

import { QuickSort } from '../../../components/QuickSort';
import { Solarized } from '../../../utilities/color';

function generateAlmostSortedArray(size: number, swaps: number): number[] {
  const rng = useRandom();

  const array = Array.from({ length: size }, (_, i) => i);
  for (let i = 0; i < swaps; i++) {
    const idx1 = Math.floor(rng.nextFloat() * size);
    const idx2 = Math.floor(rng.nextFloat() * size);
    [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
  }
  return array;
}

function generateTwoValueArray(size: number): number[] {
  const rng = useRandom();
  return Array.from({ length: size }, () => (rng.nextFloat() < 0.5 ? 1 : 2));
}

function generateTripletsArray(size: number): number[] {
  if (size % 3 !== 0) {
    throw new Error('Size must be a multiple of 3');
  }
  const nChunks = Math.floor(size / 3);

  const rng = useRandom();
  const smallArray = Array.from({ length: size / 3 }, () => {
    return Math.floor(rng.nextFloat() * nChunks) * 3 + 1;
  });
  const array: number[] = [];
  for (const value of smallArray) {
    array.push(value, value + 1, value + 2);
  }
  return array;
}

export default makeScene2D(function* (view) {
  yield* beginSlide('sorting many quicksorts');
  view.fill(Solarized.background);

  // Grid configuration
  const gridRows = 3;
  const gridCols = 4;

  // Create QuickSort instances array with refs
  const quickSorts: QuickSort[] = [];

  // Generate grid data
  const gridData = Array.from({ length: gridRows }, (_, row) =>
    Array.from({ length: gridCols }, (_, col) => {
      const sortIndex = row * gridCols + col;
      const elementCount = 18;

      return {
        elementCount,
      };
    }),
  );

  view.add(
    <Layout layout direction={'column'} gap={200} scale={0.35}>
      {gridData.map((rowData, rowIndex) => (
        <Layout key={`${rowIndex}`} layout direction={'row'} gap={250}>
          {rowData.map((config, colIndex) => {
            const quickSort = new QuickSort({
              ...config,
              elementGap: 8,
              width: 800,
              height: 600,
              animationSpeed: 0.1,
            });

            // Shuffle each instance for different starting configurations
            // quickSort.shuffle();

            switch (colIndex) {
              case 0:
                quickSort.shuffle();
                break;
              case 1:
                quickSort.setValues(
                  generateAlmostSortedArray(config.elementCount, 3),
                  true,
                );
                break;
              case 2:
                quickSort.setValues(generateTwoValueArray(config.elementCount), true);
                break;
              case 3:
                quickSort.setValues(generateTripletsArray(config.elementCount), true);
                break;
            }

            quickSorts.push(quickSort);

            return quickSort;
          })}
        </Layout>
      ))}
    </Layout>,
  );

  // Initialize all QuickSort visualizations simultaneously
  yield* all(...quickSorts.map((qs) => qs.initialize()));

  yield* beginSlide('sorting many quicksorts go');

  // Sort all QuickSorts simultaneously - this creates a mesmerizing effect
  yield* all(...quickSorts.map((qs) => chain(qs.sort(), qs.opacity(0.1, 1))));

  // Hold the final state
  yield* beginSlide('sorting many quicksorts end');
});
