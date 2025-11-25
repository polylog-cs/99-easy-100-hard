import { Circle, insert, Layout, lines, Rect } from '@motion-canvas/2d';
import { Code } from '@motion-canvas/2d/lib/components';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  createRef,
  createSignal,
  DEFAULT,
  fadeTransition,
  linear,
  SoundBuilder,
  Vector2,
} from '@motion-canvas/core';
import { all, loop, sequence, waitFor } from '@motion-canvas/core/lib/flow';

// Custom components
import { ShikiHighlighter } from '../../components/Shiki';
import { Solarized } from '../../utilities/color';
import {
  beginAnnonymousSlide,
  createSectionHeader,
  showHeader,
} from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

// Code highlighter for JavaScript
const tsHighlighter = new ShikiHighlighter({
  highlighter: {
    lang: 'typescript',
    theme: 'solarized-light',
  },
});

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);

  view.fill(Solarized.background);

  let code = createRef<Code>();
  let codeBackground = createRef<Rect>();
  let headerRef = createRef<PolyTxt>();

  yield* waitFor(0.5);

  // // Create and show header
  // createSectionHeader(view, headerRef, {
  //   text: 'Creating and Animating Shapes',
  //   fontSize: 80,
  //   position: [0, -530],
  // });

  // view.scale(0.9);
  // view.position(view.position().add(new Vector2(0, 70)));
  // view.fill(Solarized.background);
  // view.stroke(Solarized.background);
  // view.lineWidth(1000);

  // yield* showHeader(headerRef, 0.5);
  // yield* waitFor(0.5);

  view.add(
    <Rect
      layout
      ref={codeBackground}
      topLeft={new Vector2(-400, 0)}
      fill={Solarized.base3}
      lineWidth={2}
      radius={30}
      lineDash={[30, 10]}
    >
      <Code highlighter={tsHighlighter} fontSize={28} ref={code} />
    </Rect>,
  );

  // Start with a basic function
  yield* all(
    codeBackground().padding(0).padding(25, 1),
    code().code(
      `\
// create square and circle objects
const rect = createRef<Rect>();
view.add(<Rect ref={rect} size={320}
    stroke={'red'} lineWidth={10} y={-200}/>);

const circle = createRef<Circle>();
view.add(<Circle ref={circle} size={320}
    stroke={'blue'} lineWidth={10} y={200}/>);

yield* all(
    rect().scale(0).scale(1, 1),
    rect().opacity(0).opacity(1, 1),
    circle().scale(0).scale(1, 1),
    circle().opacity(0).opacity(1, 1),
);

yield* sequence(
    0.25,
    rect().opacity(0, 1),
    circle().opacity(0, 1),
);`,
      1,
    ),
  );

  yield* beginAnnonymousSlide();

  // create square and circle objects
  const rect = createRef<Rect>();
  view.add(
    <Rect
      ref={rect}
      size={320}
      stroke={Solarized.red}
      lineWidth={10}
      x={500}
      y={-200}
      opacity={0}
    />,
  );

  const circle = createRef<Circle>();
  view.add(
    <Circle
      ref={circle}
      size={320}
      stroke={Solarized.blue}
      lineWidth={10}
      x={500}
      y={200}
      opacity={0}
    />,
  );

  yield loop(() => codeBackground().lineDashOffset(0).lineDashOffset(40, 0.25, linear));

  yield* all(
    codeBackground().lineWidth(0).lineWidth(5, 0.5),
    codeBackground().stroke(Solarized.gray, 0.5),
    rect().scale(0).scale(1, 1),
    rect().opacity(0).opacity(1, 1),
    circle().scale(0).scale(1, 1),
    circle().opacity(0).opacity(1, 1),
  );

  yield* sequence(0.25, rect().opacity(0, 1), circle().opacity(0, 1));

  yield* all(
    codeBackground().lineWidth(0, 0.5),
    codeBackground().stroke(Solarized.base1, 0.5),
  );

  yield* beginAnnonymousSlide();

  yield* all(
    codeBackground().lineWidth(0).lineWidth(5, 0.5),
    codeBackground().stroke(Solarized.gray, 0.5),
  );

  yield* beginAnnonymousSlide();

  yield* all(code().selection(lines(0, 8), 0.5));

  yield* beginAnnonymousSlide();

  yield* all(code().selection(lines(9, 15), 0.5));

  yield* all(
    rect().scale(0).scale(1, 1),
    rect().opacity(0).opacity(1, 1),
    circle().scale(0).scale(1, 1),
    circle().opacity(0).opacity(1, 1),
  );

  yield* beginAnnonymousSlide();

  yield* all(code().selection(lines(16, 20), 0.5));

  yield* sequence(0.25, rect().opacity(0, 1), circle().opacity(0, 1));

  yield* beginAnnonymousSlide();

  yield* all(
    codeBackground().lineWidth(0, 0.5),
    codeBackground().stroke(Solarized.base1, 0.5),
    code().selection(DEFAULT, 0.5),
  );

  yield* beginAnnonymousSlide();
});
