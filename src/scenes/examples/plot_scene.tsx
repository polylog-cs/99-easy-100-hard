import { Circle, Layout, Line, makeScene2D, Rect } from '@motion-canvas/2d';
import {
  all,
  createRef,
  delay,
  Reference,
  sequence,
  ThreadGenerator,
  Vector2,
  waitFor,
} from '@motion-canvas/core';

import { LinePlot } from '../../components/LinePlot';
import { Plot } from '../../components/Plot';
import { Solarized } from '../../utilities/color';
import { PolyLatex } from '../../utilities/latex';
import { beginAnnonymousSlide } from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

// f(x) = x^4 + 3x - 1
const f = (x: number) => Math.pow(x, 4) + 3 * x - 1;

// g(x) = (x^2 + x + 1)(x^2 - 1)
const g = (x: number) => (x * x + x + 1) * (x * x - 1);

// Intersection points: x = -2 (y=9), x = 0 (y=-1), x = 2 (y=21)
const intersections = [
  { x: -2, y: 9 },
  { x: 0, y: -1 },
  { x: 2, y: 21 },
];

/**
 * Highlight a circle marker by scaling it up
 */
function* highlightMarker(
  marker: Reference<Circle>,
  duration: number = 0.3,
  scale: number = 1.8,
): ThreadGenerator {
  yield* marker().scale(scale, duration);
}

/**
 * Unhighlight a circle marker by returning to normal scale
 */
function* unhighlightMarker(
  marker: Reference<Circle>,
  duration: number = 0.3,
): ThreadGenerator {
  yield* marker().scale(1, duration);
}

/**
 * Pulse highlight a circle marker
 */
function* pulseMarker(
  marker: Reference<Circle>,
  duration: number = 0.6,
  scale: number = 1.8,
): ThreadGenerator {
  yield* highlightMarker(marker, duration / 2, scale);
  yield* unhighlightMarker(marker, duration / 2);
}

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);
  yield* beginAnnonymousSlide();

  // Create the plot with axes
  const plot = createRef<Plot>();

  view.add(
    <Plot
      ref={plot}
      xMin={-3}
      xMax={3}
      yMin={-5}
      yMax={35}
      xTicks={[-2, -1, 1, 2]}
      yTicks={[5, 10, 15, 20, 25, 30]}
      plotWidth={1600}
      plotHeight={700}
    />,
  );

  // Create legend
  const legend = createRef<Rect>();
  const legendItem1 = createRef<Layout>();
  const legendItem2 = createRef<Layout>();

  view.add(
    <Rect
      ref={legend}
      layout
      direction={'column'}
      gap={15}
      padding={20}
      topRight={[-500, -340]}
      opacity={0}
      fill={Solarized.base3}
      stroke={Solarized.base1}
      lineWidth={2}
      radius={8}
    >
      <Layout ref={legendItem1} layout direction={'row'} gap={15} alignItems={'center'}>
        <Line
          points={[new Vector2(0, 0), new Vector2(50, 0)]}
          stroke={Solarized.red}
          lineWidth={4}
        />
        <PolyLatex tex={'f(x) = x^4 + 3x - 1'} fontSize={35} />
      </Layout>
      <Layout ref={legendItem2} layout direction={'row'} gap={15} alignItems={'center'}>
        <Line
          points={[new Vector2(0, 0), new Vector2(50, 0)]}
          stroke={Solarized.blue}
          lineWidth={4}
        />
        <PolyLatex tex={'g(x) = (x^2 + x + 1)(x^2 - 1)'} fontSize={35} />
      </Layout>
    </Rect>,
  );

  yield* beginAnnonymousSlide();

  // Create the line plots for both functions
  const redCurve = createRef<LinePlot>();
  const blueCurve = createRef<LinePlot>();

  // Create area between curves
  const areaBetween = createRef<Line>();
  const samples = 200;
  const xMin = -3;
  const xMax = 3;
  const step = (xMax - xMin) / samples;

  // Points along f(x) from left to right
  const fPoints: Vector2[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = xMin + i * step;
    fPoints.push(plot().getPointFromPlotSpace(x, f(x)));
  }

  // Points along g(x) from right to left (reversed)
  const gPoints: Vector2[] = [];
  for (let i = samples; i >= 0; i--) {
    const x = xMin + i * step;
    gPoints.push(plot().getPointFromPlotSpace(x, g(x)));
  }

  // Combine to create closed polygon
  const areaPoints = [...fPoints, ...gPoints];

  plot().add(
    <>
      <Line
        ref={areaBetween}
        points={areaPoints}
        closed
        fill={Solarized.yellow}
        opacity={0}
        zIndex={-1}
      />
      <LinePlot
        ref={redCurve}
        plot={plot()}
        fn={f}
        stroke={Solarized.red}
        lineWidth={5}
      />
      <LinePlot
        ref={blueCurve}
        plot={plot()}
        fn={g}
        stroke={Solarized.blue}
        lineWidth={5}
      />
    </>,
  );

  // Create intersection markers and labels (initially hidden)
  const markers: Reference<Circle>[] = [];
  const markerLabels: Reference<PolyTxt>[] = [];
  const labelOffsets = [
    new Vector2(80, -57), // (-2, 9) - top left
    new Vector2(96, -85), // (0, -1) - bottom right
    new Vector2(-92, -52), // (2, 21) - top right
  ];

  for (let i = 0; i < intersections.length; i++) {
    const intersection = intersections[i];
    const marker = createRef<Circle>();
    const label = createRef<PolyTxt>();
    markers.push(marker);
    markerLabels.push(label);
    const pos = plot().getPointFromPlotSpace(intersection.x, intersection.y);
    view.add(
      <>
        <Circle
          ref={marker}
          position={pos}
          size={20}
          fill={Solarized.gray}
          opacity={0}
          scale={0}
        />
        <PolyTxt
          ref={label}
          text={`(${intersection.x}, ${intersection.y})`}
          fontSize={50}
          fill={Solarized.gray}
          position={pos.add(labelOffsets[i])}
          opacity={0}
          scale={0}
        />
      </>,
    );
  }

  const drawDuration = 2;
  const t1 = 0.9;
  const t2 = 1.0;
  const t3 = 1.15;

  yield* all(
    delay(0.5, legend().opacity(1, 0.5)),
    sequence(
      0.25,
      redCurve().animateDraw(drawDuration),
      blueCurve().animateDraw(drawDuration),
    ),
    // Appear intersection markers and labels at calculated times
    delay(t1, all(markers[0]().opacity(1, 0.2), markers[0]().scale(1, 0.3))),
    delay(t2, all(markers[1]().opacity(1, 0.2), markers[1]().scale(1, 0.3))),
    delay(t3, all(markers[2]().opacity(1, 0.2), markers[2]().scale(1, 0.3))),
  );

  yield* beginAnnonymousSlide();

  // yield* redCurve().highlight(0.3);
  // yield* all(redCurve().unhighlight(0.3), blueCurve().highlight(0.3));
  // yield* blueCurve().unhighlight(0.3);

  yield* areaBetween().opacity(1, 0.8);

  yield* beginAnnonymousSlide();

  yield* all(
    sequence(
      0.03,
      markers[0]().size(40, 1.0),
      markerLabels[0]().opacity(1, 1.0),
      markerLabels[0]().scale(1, 1.0),
      markers[1]().size(40, 1.0),
      markerLabels[1]().opacity(1, 1.0),
      markerLabels[1]().scale(1, 1.0),
      markers[2]().size(40, 1.0),
      markerLabels[2]().opacity(1, 1.0),
      markerLabels[2]().scale(1, 1.0),
    ),
  );

  // yield* beginAnnonymousSlide();

  // // Demonstrate highlighting intersection markers
  // yield* pulseMarker(markers[0]);
  // yield* pulseMarker(markers[1]);
  // yield* pulseMarker(markers[2]);

  // yield* beginAnnonymousSlide();

  // // Show explanation text
  // const explanationText = createRef<PolyTxt>();

  // view.add(
  //   <PolyTxt
  //     ref={explanationText}
  //     text={'x = 2: unlucky guess!'}
  //     fontSize={50}
  //     fill={Solarized.magenta}
  //     position={[0, 400]}
  //     opacity={0}
  //   />,
  // );

  // yield* all(
  //   explanationText().opacity(1, 0.5),
  //   explanationText().text('').text('x = 2: unlucky guess!', 1),
  //   highlightMarker(markers[2], 0.5),
  // );

  // yield* waitFor(1);
  // yield* beginAnnonymousSlide();
});
