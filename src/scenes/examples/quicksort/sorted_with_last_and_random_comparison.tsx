import { Circle, Layout, Line, makeScene2D, Txt } from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  easeOutCubic,
  fadeTransition,
  sequence,
  useLogger,
  Vector2,
  waitFor,
} from '@motion-canvas/core';

import { QuickSort } from '../../../components/QuickSort';
import { Solarized } from '../../../utilities/color';
import { beginAnnonymousSlide } from '../../../utilities/presentation';
import { PolyTxt } from '../../../utilities/text';
import { createShadow } from '../../../utilities/visuals';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);
  view.fill(Solarized.background);

  // Grid configuration
  const gridRows = 2;
  const gridCols = 2;
  const elementCount = 16;

  // Create QuickSort instances arrays for left and right
  const leftQuickSorts: QuickSort[] = [];
  const rightQuickSorts: QuickSort[] = [];

  // Create refs for the comparison line visualization
  const comparisonLine = createRef<Line>();
  const zeroLabel = createRef<Txt>();
  const maxLabel = createRef<Txt>();
  const comparisonLabel = createRef<Txt>();
  const leftCircles: Array<createRef<Circle>> = [];
  const rightCircles: Array<createRef<Circle>> = [];

  // Create the main layout with two groups
  view.add(
    <Layout layout direction={'row'} gap={400} scale={0.65} y={0}>
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

  yield* waitFor(0.5);

  // Add comparison count line visualization
  const lineY = 370;
  const lineStartX = -700;
  const lineEndX = 700;
  const lineLength = lineEndX - lineStartX;
  const maxComparisons = 160;

  const randomizedLabel = createRef<Txt>();
  const lastLabel = createRef<Txt>();

  // Add the comparison line
  view.add(
    <>
      <Line
        ref={comparisonLine}
        points={[
          [lineStartX, lineY],
          [lineEndX, lineY],
        ]}
        stroke={Solarized.base01}
        lineWidth={3}
        opacity={0}
      />

      {/* Add labels */}
      <PolyTxt
        text="Randomized"
        position={new Vector2(-450, -340)}
        fontSize={70}
        opacity={0}
        ref={randomizedLabel}
      />
      <PolyTxt
        text="Almost sorted"
        position={new Vector2(450, -340)}
        fontSize={70}
        opacity={0}
        ref={lastLabel}
      />
      <Txt
        ref={zeroLabel}
        text="0"
        position={[lineStartX, lineY + 60]}
        fontSize={50}
        fontFamily="monospace"
        fill={Solarized.base00}
        opacity={0}
      />
      <Txt
        ref={maxLabel}
        text={`${maxComparisons}`}
        position={[lineEndX, lineY + 60]}
        fontSize={50}
        fontFamily="monospace"
        fill={Solarized.base00}
        opacity={0}
      />
      <PolyTxt
        ref={comparisonLabel}
        text="Comparisons"
        position={[0, lineY + 60]}
        fontSize={50}
        fill={Solarized.base00}
        opacity={0}
      />
    </>,
  );

  view.add(createShadow(randomizedLabel));
  view.add(createShadow(lastLabel));

  // Pre-create all circles for left sorts (green)
  for (let i = 0; i < leftQuickSorts.length; i++) {
    const circleRef = createRef<Circle>();
    leftCircles.push(circleRef);
    view.add(
      <Circle
        ref={circleRef}
        position={[0, lineY]} // Will be positioned later
        size={16}
        fill={Solarized.green}
        opacity={0}
        stroke={Solarized.green}
        lineWidth={2}
        scale={0}
      />,
    );
  }

  // Pre-create all circles for right sorts (red)
  for (let i = 0; i < rightQuickSorts.length; i++) {
    const circleRef = createRef<Circle>();
    rightCircles.push(circleRef);
    view.add(
      <Circle
        ref={circleRef}
        position={[0, lineY]} // Will be positioned later
        size={16}
        fill={Solarized.red}
        opacity={0}
        stroke={Solarized.red}
        lineWidth={2}
        scale={0}
      />,
    );
  }

  // Initialize all QuickSort visualizations simultaneously
  yield* all(
    ...leftQuickSorts.map((qs) => qs.initialize(0.01, 0.25)),
    ...rightQuickSorts.map((qs) => qs.initialize(0.01, 0.25)),
    comparisonLine().opacity(1, 0.5),
    zeroLabel().opacity(1, 0.5),
    maxLabel().opacity(1, 0.5),
    comparisonLabel().opacity(1, 0.5),
    randomizedLabel().opacity(1, 0.5),
    lastLabel().opacity(1, 0.5),
  );

  yield* beginAnnonymousSlide();

  // Helper function to animate a circle appearing at the correct position
  function* animateComparisonCircle(circle: Circle, from: QuickSort) {
    const x = (from.comparisonCount / maxComparisons) * lineLength;

    // Position the circle
    circle.absolutePosition(from.absolutePosition());

    // Animate it appearing
    yield* chain(
      circle.opacity(0.25, 0.25),
      all(
        circle.opacity(1, 0.5),
        circle.scale(5).scale(2, 0.5),
        circle.position(new Vector2(comparisonLine().points()[0]).addX(x), 0.5),
      ),
    );
  }

  // Sort all arrays and animate circles as they complete
  yield* all(
    ...leftQuickSorts.map((qs, index) =>
      chain(
        qs.sort('first', 0.1, 0.05),
        all(
          all(qs.uninitialize(0.01, 0.25), qs.showComparisonCount(Solarized.green)),
          animateComparisonCircle(leftCircles[index](), qs),
        ),
      ),
    ),
    ...rightQuickSorts.map((qs, index) =>
      chain(
        qs.sort('first', 0.1, 0.05),
        all(
          all(qs.uninitialize(0.01, 0.25), qs.showComparisonCount(Solarized.red)),
          animateComparisonCircle(rightCircles[index](), qs),
        ),
      ),
    ),
  );

  yield* beginAnnonymousSlide();
});
