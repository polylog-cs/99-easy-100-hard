import { Circle, insert, Layout, lines, Rect } from '@motion-canvas/2d';
import { Code } from '@motion-canvas/2d/lib/components';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  createRef,
  createSignal,
  DEFAULT,
  delay,
  fadeTransition,
  linear,
  SoundBuilder,
  Vector2,
} from '@motion-canvas/core';
import { all, loop, sequence, waitFor } from '@motion-canvas/core/lib/flow';

// Custom components
import { ShikiHighlighter } from '../../components/Shiki';
import { Solarized } from '../../utilities/color';
import { beginAnnonymousSlide } from '../../utilities/presentation';

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

  yield* waitFor(0.5);

  view.add(
    <Rect
      layout
      ref={codeBackground}
      topLeft={new Vector2(-400, 0)}
      fill={Solarized.base3}
      lineWidth={2}
      radius={30}
      lineDash={[30, 10]}
      scale={0.9}
    >
      <Code highlighter={tsHighlighter} fontSize={28} ref={code} />
    </Rect>,
  );

  // Start with the function code
  yield* all(
    codeBackground().padding(0).padding(25, 1),
    code().code(
      `\
export default makeScene2D(function* (view) {
    const rect = createRef<Rect>();
    view.add(<Rect ref={rect} size={320} fill={'red'}
      stroke={'red'} lineWidth={10} x={-300}/>);

    yield* appear(rect());

    let n = 5;

    yield* all(
        // change position
        rect().x(300, n),

        // at the same time as scale
        delay(
            n / 4,
            rect().scale(1.5, n / 4).to(1, n / 4),
        ),

        // at the same time as rotation
        delay(
            n / 8 * 3,
            rect().rotation(-90, n / 4).to(90, n / 4),
        ),
    );
});`,
      1,
    ),
  );

  yield* beginAnnonymousSlide();

  // Create the rect object that will be animated
  const rect = createRef<Rect>();
  view.add(
    <Rect
      ref={rect}
      size={250}
      fill={Solarized.red}
      stroke={Solarized.red}
      lineWidth={10}
      x={500}
      y={-200}
      opacity={0}
      scale={0}
    />,
  );

  yield loop(() => codeBackground().lineDashOffset(0).lineDashOffset(40, 0.25, linear));

  yield* all(
    codeBackground().lineWidth(0).lineWidth(5, 0.5),
    codeBackground().stroke(Solarized.gray, 0.5),
  );

  // Execute the animation
  let n = 5;

  yield* all(rect().opacity(0).opacity(1, 1), rect().scale(0).scale(1, 1));

  yield* all(
    // change position
    rect().y(200, n),
    code().selection(lines(9, 11), 0.5),

    // at the same time as scale
    delay(
      n / 4,
      // we can chain two scale changes by using .to()
      all(
        rect()
          .scale(1.5, n / 4)
          .to(1, n / 4),
        code().selection(lines(9, 18), 0.5),
      ),
    ),

    // at the same time as rotation
    delay(
      (n / 8) * 3,
      all(
        rect()
          .rotation(-90, n / 4)
          .to(90, n / 4),
        code().selection(lines(9, 24), 0.5),
      ),
    ),
  );

  yield* all(code().selection(DEFAULT, 0.5), rect().opacity(0, 1), rect().scale(0, 1));

  yield* all(
    codeBackground().lineWidth(0, 0.5),
    codeBackground().stroke(Solarized.base1, 0.5),
  );

  yield* beginAnnonymousSlide();
});
