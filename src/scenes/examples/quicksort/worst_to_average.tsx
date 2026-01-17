import { Circle, Layout, Line, makeScene2D, Txt } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  chain,
  Color,
  createRef,
  createSignal,
  delay,
  easeOutCubic,
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
  view.fill(Solarized.background);

  const qs1 = createRef<QuickSort>();

  const width = createSignal(600);
  const height = createSignal(400);
  const elementGap = createSignal(15);

  const commonProps = {
    elementGap: elementGap,
    width: width,
    height: height,
    elementCount: 12,
    animationSpeed: 0.2,
    position: [-450, 0],
  };

  // Grid configuration for later
  const gridRows = 3;
  const gridCols = 3;
  const leftQuickSorts: QuickSort[] = [];
  const rightQuickSorts: QuickSort[] = [];

  view.add(<QuickSort ref={qs1} {...commonProps} />);

  yield* waitFor(0.5);

  const qs2 = createRef<QuickSort>();
  view.add(<QuickSort ref={qs2} {...commonProps} />);

  qs1().almostSort();
  qs2().setValues(qs1().getValues());

  yield* beginAnnonymousSlide();

  yield* all(qs1().initialize(), qs2().initialize());

  const worstCaseLabel = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      ref={worstCaseLabel}
      text=""
      fill={Solarized.red}
      fontSize={70}
      position={[-400, 300]}
    />,
  );
  yield* worstCaseLabel().text('Worst Case', 1);

  yield* beginAnnonymousSlide();

  // Move qs2 to the right

  // Create an arrow between the two QuickSort components
  const arrow = createRef<Line>();
  view.add(
    <Line
      ref={arrow}
      points={[
        new Vector2(-70, 0), // end of qs1
        new Vector2(70, 0), // start of qs2
      ]}
      stroke={Solarized.base01}
      lineWidth={15}
      endArrow
      position={[0, 0]}
      end={0}
    />,
  );

  const shuffleLabel = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      ref={shuffleLabel}
      text=""
      fill={Solarized.base00}
      fontSize={60}
      position={[0, -80]}
    />,
  );

  yield* all(
    qs2().position(new Vector2(450, 0), 1),
    arrow().end(1, 1),
    shuffleLabel().text('shuffle', 1),
  );

  yield* qs2().shuffleAnimated(0.15);

  const averageCaseLabel = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      ref={averageCaseLabel}
      text=""
      fill={Solarized.green}
      fontSize={70}
      position={[400, 300]}
    />,
  );
  yield* averageCaseLabel().text('Average Case', 1);

  yield* beginAnnonymousSlide();

  // Store current absolute positions of qs1 and qs2
  const qs1CurrentPos = qs1().absolutePosition();
  const qs2CurrentPos = qs2().absolutePosition();

  // Create grid layouts
  const leftGridLayout = createRef<Layout>();
  const rightGridLayout = createRef<Layout>();

  // Create the remaining QuickSort instances for the grids
  const gridElementCount = 12;
  const gapX = 90;
  const gapY = 50;
  const gridProps = {
    elementCount: gridElementCount,
    elementGap: 5,
    width: 150,
    height: 100,
  };

  // Fill the left grid with almost sorted arrays (worst case)
  // First slot is for qs1, so create (gridRows * gridCols - 1) new instances
  for (let i = 0; i < gridRows * gridCols; i++) {
    const qs = new QuickSort({
      ...gridProps,
      colors: {
        default: Solarized.red,
      },
    });
    qs.almostSort();
    leftQuickSorts.push(qs);
  }

  // Fill the right grid with shuffled arrays (average case)
  // First slot is for qs2, so create (gridRows * gridCols - 1) new instances
  for (let i = 0; i < gridRows * gridCols; i++) {
    const qs = new QuickSort({
      ...gridProps,
      colors: {
        default: Solarized.red,
      },
    });
    qs.almostSort();
    rightQuickSorts.push(qs);
  }

  // Create the grid layout
  const mainLayout = createRef<Layout>();

  view.add(
    <Layout ref={mainLayout} layout direction={'row'} gap={270} y={-50}>
      {/* Left grid - Almost sorted (worst case) */}
      <Layout ref={leftGridLayout} layout direction={'column'} gap={gapX}>
        {Array.from({ length: gridRows }, (_, rowIndex) => (
          <Layout key={`left-${rowIndex}`} layout direction={'row'} gap={gapY}>
            {Array.from({ length: gridCols }, (_, colIndex) => {
              const index = rowIndex * gridCols + colIndex;
              return leftQuickSorts[index];
            })}
          </Layout>
        ))}
      </Layout>

      {/* Right grid - Shuffled (average case) */}
      <Layout ref={rightGridLayout} layout direction={'column'} gap={gapX}>
        {Array.from({ length: gridRows }, (_, rowIndex) => (
          <Layout key={`right-${rowIndex}`} layout direction={'row'} gap={gapY}>
            {Array.from({ length: gridCols }, (_, colIndex) => {
              const index = rowIndex * gridCols + colIndex;
              return rightQuickSorts[index];
            })}
          </Layout>
        ))}
      </Layout>
    </Layout>,
  );

  // Animate qs1 and qs2 moving to their grid positions and resize them
  yield* all(
    shuffleLabel().opacity(0, 0.5),
    arrow().opacity(0, 0.5),
    qs1().absolutePosition(leftQuickSorts[0].absolutePosition, 1),
    qs2().absolutePosition(rightQuickSorts[0].absolutePosition, 1),
    width(gridProps.width, 1),
    height(gridProps.height, 1),
    elementGap(gridProps.elementGap, 1),

    ...qs1().rectangles.map((rect) => rect().fill(Solarized.red, 1)),
    ...qs2().rectangles.map((rect) => rect().fill(Solarized.green, 1)),
    delay(
      0.75,
      all(
        ...leftQuickSorts
          .slice(1, leftQuickSorts.length)
          .map((qs) => all(qs.opacity(1, 0.5), qs.initialize(0.01, 0.5))),
        ...rightQuickSorts
          .slice(1, rightQuickSorts.length)
          .map((qs) => all(qs.opacity(1, 0.5), qs.initialize(0.01, 0.5))),
      ),
    ),
  );

  yield* beginAnnonymousSlide();

  yield* all(
    ...rightQuickSorts.slice(1, rightQuickSorts.length).map((qs, i) => {
      if (i === 3) {
        return all(qs.badShuffleAnimated(0.15));
      } else {
        return all(
          qs.shuffleAnimated(0.15),
          ...qs.rectangles.map((rect) =>
            rect().fill(Solarized.green, 0.15 * qs.rectangles.length),
          ),
        );
      }
    }),
  );

  yield* waitFor(0.5);

  const isBad = createRef<PolyTxt>();

  view.add(
    <PolyTxt
      ref={isBad}
      text=""
      fontSize={45}
      position={() => worstCaseLabel().position().addY(80)}
    />,
  );

  const isGood = createRef<PolyTxt>();

  view.add(
    <PolyTxt
      ref={isGood}
      text=""
      fontSize={45}
      position={() => averageCaseLabel().position().addY(80)}
    />,
  );

  yield* all(
    worstCaseLabel().text('Worst Case Input', 1),
    averageCaseLabel().text('Worst Case Luck', 1),
    isBad().text('(these are bad)', 1),
    isGood().text("(this one's fine)", 1),
    ...rightQuickSorts.slice(1, rightQuickSorts.length).map((qs, i) => {
      if (i === 3) {
        return qs2().opacity(0.25, 0.5);
      } else {
        return all(qs.opacity(0.25, 0.5));
      }
    }),
  );
});
