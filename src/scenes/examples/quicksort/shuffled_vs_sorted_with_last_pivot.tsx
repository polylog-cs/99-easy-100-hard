import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, chain, waitFor } from '@motion-canvas/core';

import { QuickSort } from '../../../components/QuickSort';
import { Solarized } from '../../../utilities/color';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  // Grid configuration
  const gridRows = 5;
  const gridCols = 3;
  const elementCount = 24;

  // Create QuickSort instances arrays for left and right
  const leftQuickSorts: QuickSort[] = [];
  const rightQuickSorts: QuickSort[] = [];

  // Create the main layout with two groups
  view.add(
    <Layout layout direction={'row'} gap={400} scale={0.4}>
      {/* Left group - Shuffled arrays */}
      <Layout layout direction={'column'} gap={150}>
        {Array.from({ length: gridRows }, (_, rowIndex) => (
          <Layout key={`left-${rowIndex}`} layout direction={'row'} gap={180}>
            {Array.from({ length: gridCols }, (_, colIndex) => {
              const quickSort = new QuickSort({
                elementCount,
                elementGap: 4,
                width: 400,
                height: 200,
              });

              quickSort.shuffle();

              leftQuickSorts.push(quickSort);

              return quickSort;
            })}
          </Layout>
        ))}
      </Layout>

      {/* Right group - Almost sorted arrays */}
      <Layout layout direction={'column'} gap={150}>
        {Array.from({ length: gridRows }, (_, rowIndex) => (
          <Layout key={`right-${rowIndex}`} layout direction={'row'} gap={180}>
            {Array.from({ length: gridCols }, (_, colIndex) => {
              let quickSort = new QuickSort({
                elementCount,
                elementGap: 4,
                width: 400,
                height: 200,
              });

              quickSort.almostSort();

              rightQuickSorts.push(quickSort);

              return quickSort;
            })}
          </Layout>
        ))}
      </Layout>
    </Layout>,
  );

  // Initialize all QuickSort visualizations simultaneously
  yield* all(
    ...leftQuickSorts.map((qs) => qs.initialize()),
    ...rightQuickSorts.map((qs) => qs.initialize()),
  );

  // Wait a moment before starting any animations
  yield* waitFor(1);

  // Optional: Sort all arrays simultaneously for a dramatic effect
  // Uncomment the following lines if you want to animate the sorting
  yield* all(
    ...leftQuickSorts.map((qs) => chain(qs.sort(), qs.showComparisonCount())),
    ...rightQuickSorts.map((qs) => chain(qs.sort(), qs.showComparisonCount())),
  );

  // Hold the final state
  yield* waitFor(2);
});
