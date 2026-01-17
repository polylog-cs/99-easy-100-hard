import { Circle, insert, Latex, Layout, lines, Rect, Txt } from '@motion-canvas/2d';
import { Code } from '@motion-canvas/2d/lib/components';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  createRef,
  createSignal,
  DEFAULT,
  delay,
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

// Code highlighter for TypeScript
const tsHighlighter = new ShikiHighlighter({
  highlighter: {
    lang: 'typescript',
    theme: 'solarized-light',
  },
});

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  let code = createRef<Code>();
  let codeBackground = createRef<Rect>();
  let headerRef = createRef<PolyTxt>();

  yield* waitFor(0.5);

  // // Create and show header
  // createSectionHeader(view, headerRef, {
  //   text: 'Signals',
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
      scale={0.8}
    >
      <Code highlighter={tsHighlighter} fontSize={28} ref={code} />
    </Rect>,
  );

  // Start with the function code
  yield* all(
    codeBackground().padding(0).padding(25, 1),
    code().code(
      `\
const circle = createRef<Circle>();
const text = createRef<Latex>();

view.add(<>
    <Circle ref={circle} lineWidth={5} size={300}/>
    <Latex ref={text}
        tex={() => \`p = [\${circle().x().toFixed(0)},
            \${circle().y().toFixed(0)}]\`}
        opacity={circle().opacity}
        scale={circle().scale}
        bottom={() => circle().top().addY(-30)}
    />
</>);

yield* all(circle().opacity(1, 1), circle().scale(1, 1));

yield* all(
    circle().position(new Vector2(400, 100), 1),
);

yield* all(
    circle().position(new Vector2(700, 300), 1),
    circle().scale(0.5, 1),
)

yield* all(
    circle().position(new Vector2(500, -100), 1),
    circle().scale(1, 1),
)

yield* all(circle().opacity(0, 1), circle().scale(0, 1));`,
      1,
    ),
  );

  yield* beginAnnonymousSlide();

  // Create the circle and text objects that will be animated
  const circle = createRef<Circle>();
  const text = createRef<Latex>();

  view.add(
    <>
      <Circle
        ref={circle}
        stroke={Solarized.text}
        lineWidth={5}
        size={300}
        x={500}
        y={-100}
        opacity={0}
        scale={0}
      />
      <Latex
        ref={text}
        fill={Solarized.text}
        tex={() => `p = [${circle().x().toFixed(0)}, ${circle().y().toFixed(0)}]`}
        opacity={() => circle().opacity()}
        scale={() => circle().scale()}
        bottom={() => circle().top().addY(-30)}
      />
    </>,
  );

  yield loop(() => codeBackground().lineDashOffset(0).lineDashOffset(40, 0.25, linear));

  yield* all(
    codeBackground().lineWidth(0).lineWidth(5, 0.5),
    codeBackground().stroke(Solarized.gray, 0.5),
  );

  // Execute the animation
  yield* all(
    circle().opacity(1, 1),
    circle().scale(1, 1),
    code().selection(lines(13, 14), 0.5),
  );

  yield* all(
    circle().position(new Vector2(400, 100), 1),
    code().selection(lines(16, 18), 0.5),
  );

  yield* all(
    circle().position(new Vector2(700, 300), 1),
    circle().scale(0.5, 1),
    code().selection(lines(20, 24), 0.5),
  );

  yield* all(
    circle().position(new Vector2(500, -100), 1),
    circle().scale(1, 1),
    code().selection(lines(25, 28), 0.5),
  );

  yield* all(
    circle().opacity(0, 1),
    circle().scale(0, 1),
    code().selection(lines(30, 30), 0.5),
  );

  yield* all(
    codeBackground().lineWidth(0, 0.5),
    codeBackground().stroke(Solarized.base1, 0.5),
    code().selection(DEFAULT, 0.5),
  );

  yield* beginAnnonymousSlide();

  yield* all(code().selection(lines(6, 10), 0.5));

  yield* beginAnnonymousSlide();

  yield* all(
    codeBackground().lineWidth(0).lineWidth(5, 0.5),
    codeBackground().stroke(Solarized.gray, 0.5),
  );

  // Execute the animation
  yield* all(circle().opacity(1, 1), circle().scale(1, 1));

  yield* all(circle().position(new Vector2(400, 100), 1));

  yield* all(circle().position(new Vector2(700, 300), 1), circle().scale(0.5, 1));

  yield* all(circle().position(new Vector2(500, -100), 1), circle().scale(1, 1));

  yield* all(circle().opacity(0, 1), circle().scale(0, 1));

  yield* all(
    codeBackground().lineWidth(0, 0.5),
    codeBackground().stroke(Solarized.base1, 0.5),
    code().selection(DEFAULT, 0.5),
  );

  yield* beginAnnonymousSlide();
});
