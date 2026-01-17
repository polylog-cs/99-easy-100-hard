import { Circle, Layout, Line, makeScene2D, Rect } from '@motion-canvas/2d';
import {
  all,
  createRef,
  createSignal,
  delay,
  linear,
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

  yield* beginAnnonymousSlide();

  // Create tracer dots and status text
  const redTracer = createRef<Circle>();
  const blueTracer = createRef<Circle>();
  const statusText = createRef<PolyTxt>();
  const tracerX = createSignal(-3);

  const threshold = 0.1;
  const minDistance = () =>
    Math.min(...intersections.map((p) => Math.abs(tracerX() - p.x)));
  const isNearIntersection = () => minDistance() < threshold;

  // Per-marker opacity based on distance to that specific intersection
  const markerOpacity = (i: number) => {
    const dist = Math.abs(tracerX() - intersections[i].x);
    const proximity = Math.max(0, 1 - dist / threshold);
    return 0.3 + 0.7 * proximity;
  };

  view.add(
    <>
      <Circle
        ref={redTracer}
        position={() => plot().getPointFromPlotSpace(tracerX(), f(tracerX()))}
        size={30}
        fill={Solarized.red}
        opacity={0}
        zIndex={10}
      />
      <Circle
        ref={blueTracer}
        position={() => plot().getPointFromPlotSpace(tracerX(), g(tracerX()))}
        size={30}
        fill={Solarized.blue}
        opacity={0}
        zIndex={10}
      />
      <PolyTxt
        ref={statusText}
        text={() => (isNearIntersection() ? 'Same.' : 'Different!')}
        fontSize={60}
        lineWidth={1}
        stroke={() => (isNearIntersection() ? Solarized.green : Solarized.red)}
        fill={() => (isNearIntersection() ? Solarized.green : Solarized.red)}
        position={() => {
          const redPos = plot().getPointFromPlotSpace(tracerX(), f(tracerX()));
          const bluePos = plot().getPointFromPlotSpace(tracerX(), g(tracerX()));
          const midY = (redPos.y + bluePos.y) / 2;
          return new Vector2(redPos.x, midY + 100);
        }}
        opacity={0}
        zIndex={10}
      />
    </>,
  );

  // Dim other elements and show tracers
  yield* all(
    plot().opacity(0.3, 0.3),
    legend().opacity(0.3, 0.3),
    redTracer().opacity(1, 0.3),
    blueTracer().opacity(1, 0.3),
    statusText().opacity(1, 0.3),
    ...markers.map((m) => m().opacity(0.3, 0.3)),
    ...markerLabels.map((l) => l().opacity(0.3, 0.3)),
  );

  markers.forEach((m, i) => m().opacity(() => markerOpacity(i)));
  markerLabels.forEach((l, i) => l().opacity(() => markerOpacity(i)));

  // Animate tracing from x = -3 to x = 3
  yield* tracerX(3, 4, linear);

  // Reset marker opacities to static and restore all elements
  markers.forEach((m) => m().opacity(0.3));
  markerLabels.forEach((l) => l().opacity(0.3));

  yield* all(
    plot().opacity(1, 0.3),
    legend().opacity(1, 0.3),
    redTracer().opacity(0, 0.3),
    blueTracer().opacity(0, 0.3),
    statusText().opacity(0, 0.3),
    ...markers.map((m) => m().opacity(1, 0.3)),
    ...markerLabels.map((l) => l().opacity(1, 0.3)),
  );

  yield* beginAnnonymousSlide();
});
