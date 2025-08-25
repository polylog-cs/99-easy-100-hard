import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, chain } from '@motion-canvas/core';

import { QuickSort } from '../../../components/QuickSort';
import { Solarized } from '../../../utilities/color';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  // Grid configuration
  const gridRows = 5;
  const gridCols = 6;

  // Create QuickSort instances array with refs
  const quickSorts: QuickSort[] = [];

  // Generate grid data
  const gridData = Array.from({ length: gridRows }, (_, row) =>
    Array.from({ length: gridCols }, (_, col) => {
      const sortIndex = row * gridCols + col;
      const elementCount = 24;

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
              width: 500,
              height: 280,
            });

            // Shuffle each instance for different starting configurations
            quickSort.shuffle();
            quickSorts.push(quickSort);

            return quickSort;
          })}
        </Layout>
      ))}
    </Layout>,
  );

  // Initialize all QuickSort visualizations simultaneously
  yield* all(...quickSorts.map((qs) => qs.initialize()));

  // Wait a moment before starting the sort
  yield* all();

  // Sort all QuickSorts simultaneously - this creates a mesmerizing effect
  yield* all(...quickSorts.map((qs) => chain(qs.sort(), qs.opacity(0.1, 1))));

  // Hold the final state
  yield* all();
});
