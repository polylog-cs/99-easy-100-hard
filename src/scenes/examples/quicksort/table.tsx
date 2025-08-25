import { Circle, Layout, makeScene2D } from '@motion-canvas/2d';
import {
  all,
  chain,
  Color,
  createRef,
  createSignal,
  delay,
  linear,
  Reference,
  useRandom,
  waitFor,
} from '@motion-canvas/core';

import { QuickSort } from '../../../components/QuickSort';
import { Solarized } from '../../../utilities/color';
import { appear } from '../../../utilities/creation';
import { PolyTxt } from '../../../utilities/text';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const random = useRandom();

  // Configuration
  const numRows = 5;
  const numCols = 9;
  const cellSize = 130;
  const circleMaxSize = 80;
  const circleMinSize = 20;
  const initialCircleSize = 15; // Small initial size for gray circles

  // Arrays to store references and final values
  const quickSorts: QuickSort[] = [];
  const headerNumbers: Reference<PolyTxt>[] = [];
  const circles: Reference<Circle>[][] = [];
  const randomHexStrings: string[] = [];
  const circleData: number[][] = [];
  const finalSizes: number[][] = [];
  const finalColors: Color[][] = [];

  // Generate random 8-character hexadecimal strings for headers
  for (let i = 0; i < numCols; i++) {
    let hexString = '';
    for (let j = 0; j < 6; j++) {
      hexString += random.nextInt(0, 15).toString(16);
    }
    randomHexStrings.push(hexString);
    headerNumbers.push(createRef<PolyTxt>());
  }

  // Generate random values for circles and store final sizes/colors
  const bias = 3; // >1 biases toward smaller values, try 2–5
  for (let i = 0; i < numRows; i++) {
    circles[i] = [];
    circleData[i] = [];
    finalSizes[i] = [];
    finalColors[i] = [];

    for (let j = 0; j < numCols; j++) {
      circles[i][j] = createRef<Circle>();
      const u = random.nextFloat(); // uniform [0,1)
      const value = Math.pow(u, bias);
      circleData[i][j] = value;

      // Calculate final size and color
      const size = circleMinSize + (circleMaxSize - circleMinSize) * value;
      const greenColor = new Color(Solarized.green);
      const redColor = new Color(Solarized.red);
      const interpolatedColor = Color.lerp(greenColor, redColor, value, 'lab');

      finalSizes[i][j] = size;
      finalColors[i][j] = interpolatedColor;
    }
  }

  const pivotSelectionLavel = createRef<PolyTxt>();

  const spacing = 200;

  // Main table layout
  view.add(
    <Layout
      layout
      direction={'column'}
      gap={10}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Layout layout direction={'row'} gap={20} alignItems={'center'}>
        <Layout width={spacing} />

        <PolyTxt
          ref={pivotSelectionLavel}
          text={'Pivot Selection Seeds'}
          fontWeight={700}
          fontSize={56}
          opacity={1}
        />
      </Layout>

      {/* Header row with empty top-left corner and random hex strings */}
      <Layout layout direction={'row'} gap={20} alignItems={'center'}>
        {/* Empty corner cell */}
        <Layout width={spacing} />

        {/* Header hex strings */}
        {randomHexStrings.map((hex, i) => (
          <Layout
            key={`header-${i}`}
            width={cellSize}
            height={50}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <PolyTxt
              ref={headerNumbers[i]}
              text={''}
              fontFamily={'monospace'}
              fontSize={32}
              opacity={1}
            />
          </Layout>
        ))}
      </Layout>

      {/* Data rows */}
      {Array.from({ length: numRows }, (_, rowIndex) => (
        <Layout
          key={`row-${rowIndex}`}
          layout
          direction={'row'}
          gap={20}
          alignItems={'center'}
        >
          {/* QuickSort instance in first column */}
          <Layout width={200} height={cellSize} alignItems={'center'}>
            {(() => {
              const qs = new QuickSort({
                elementCount: 8,
                elementGap: 2,
                width: 180,
                height: 100,
                animationSpeed: 0.5,
              });
              qs.shuffle();
              quickSorts.push(qs);
              return qs;
            })()}
          </Layout>

          {/* Circle cells - initially small and gray */}
          {Array.from({ length: numCols }, (_, colIndex) => (
            <Layout
              key={`cell-${rowIndex}-${colIndex}`}
              width={cellSize}
              height={cellSize}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Circle
                ref={circles[rowIndex][colIndex]}
                size={initialCircleSize}
                fill={Solarized.gray} // Gray color
                scale={0}
                opacity={0.25}
              />
            </Layout>
          ))}
        </Layout>
      ))}
    </Layout>,
  );

  // Create uniformly spaced delays, then shuffle them
  const totalCircles = numRows * numCols;
  const uniformDelays: number[] = [];
  for (let i = 0; i < totalCircles; i++) {
    uniformDelays.push((i / (totalCircles - 1)) * 0.5); // Values from 0 to 1
  }

  // Shuffle the uniform delays
  for (let i = uniformDelays.length - 1; i > 0; i--) {
    const j = Math.floor(random.nextFloat() * (i + 1));
    [uniformDelays[i], uniformDelays[j]] = [uniformDelays[j], uniformDelays[i]];
  }

  // Assign shuffled delays to circles
  const circleDelays: number[][] = [];
  let delayIndex = 0;
  for (let i = 0; i < numRows; i++) {
    circleDelays[i] = [];
    for (let j = 0; j < numCols; j++) {
      circleDelays[i][j] = uniformDelays[delayIndex++];
    }
  }

  // Highlight function
  function* highlight(
    rowIndexes: number[],
    columnIndexes: number[],
    mode: 'or' | 'and' = 'or',
    duration: number = 0.5,
    opacity: number = 0.1,
  ) {
    const animations = [];

    // Handle circles
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let isHighlighted: boolean;

        if (mode === 'or') {
          // Union: highlight if in specified row OR column
          isHighlighted = rowIndexes.includes(i) || columnIndexes.includes(j);
        } else {
          // Intersection: highlight only if in specified row AND column
          isHighlighted = rowIndexes.includes(i) && columnIndexes.includes(j);
        }

        const targetOpacity = isHighlighted ? 1 : opacity; // Keep highlighted at 0.8, dim others to 0.4

        animations.push(circles[i][j]().opacity(targetOpacity, duration));
      }
    }

    // Handle QuickSort instances (row headers)
    for (let i = 0; i < numRows; i++) {
      const isHighlighted = rowIndexes.includes(i);
      const targetOpacity = isHighlighted ? 1 : opacity;
      animations.push(quickSorts[i].opacity(targetOpacity, duration));
    }

    // Handle column headers (hex strings)
    for (let j = 0; j < numCols; j++) {
      const isHighlighted = columnIndexes.includes(j);
      const targetOpacity = isHighlighted ? 1 : opacity;
      animations.push(headerNumbers[j]().opacity(targetOpacity, duration));
    }

    yield* all(...animations);
  }

  // Unhighlight function to restore original opacity
  function* unhighlight(duration: number = 0.5) {
    const animations = [];

    // Restore circles
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        animations.push(circles[i][j]().opacity(0.8, duration));
      }
    }

    // Restore QuickSort instances
    for (let i = 0; i < numRows; i++) {
      animations.push(quickSorts[i].opacity(1, duration));
    }

    // Restore column headers
    for (let j = 0; j < numCols; j++) {
      animations.push(headerNumbers[j]().opacity(1, duration));
    }

    yield* all(...animations);
  }

  // Animation sequence
  yield* all(
    // Initialize all QuickSort instances together
    ...quickSorts.map((qs) => qs.initialize()),
    appear(pivotSelectionLavel),

    // Animate header text (8-character hex strings)
    ...headerNumbers.map((ref, i) => ref().text(randomHexStrings[i], 1)),

    ...circles.flatMap((row, i) =>
      row.map((circleRef, j) => chain(waitFor(0), circleRef().scale(1, 0.5))),
    ),
  );

  yield* waitFor(0.5);

  // Second animation: Transform to final size, color, and opacity
  yield* all(
    ...circles.flatMap((row, i) =>
      row.map((circleRef, j) =>
        all(
          circleRef().size(finalSizes[i][j], 0.6),
          circleRef().fill(finalColors[i][j], 0.6),
          circleRef().opacity(1, 0.6),
        ),
      ),
    ),
  );

  // Example usage of highlight function
  yield* waitFor(1);

  // Highlight row 1 and column 2
  yield* highlight([], [6]);

  yield* waitFor(1);

  // Highlight multiple rows and columns
  yield* highlight([3], [6], 'and');

  yield* waitFor(1);

  // Highlight multiple rows and columns
  yield* highlight([3], []);

  yield* waitFor(1);

  for (let i = 0; i < numCols; i++) {
    let idx = random.nextInt(0, numCols - 1);

    // Highlight multiple rows and columns
    yield* highlight([3], [idx], 0.1);
  }

  yield* waitFor(1);
});
