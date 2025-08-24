import { Layout, makeScene2D, Rect } from '@motion-canvas/2d';
import { Code } from '@motion-canvas/2d/lib/components';
import {
  all,
  chain,
  Color,
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  linear,
  loop,
  useRandom,
  waitFor,
} from '@motion-canvas/core';

import { ShikiHighlighter } from '../../components/Shiki';
import { Solarized } from '../../utilities/color';
import { appear } from '../../utilities/creation';
import { PolyLatex } from '../../utilities/latex';
import { PolyTxt } from '../../utilities/text';
import { createShadow } from '../../utilities/visuals';

// Julia code highlighter
const juliaHighlighter = new ShikiHighlighter({
  highlighter: {
    lang: 'julia',
    theme: 'solarized-light',
  },
});

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const simpleLayout = createRef<Layout>();
  const simpleEquation = createRef<PolyLatex>();
  const simpleText = createRef<PolyTxt>();
  const complexLayout = createRef<Layout>();
  const complexEquation = createRef<PolyLatex>();
  const complexText = createRef<PolyTxt>();
  const juliaCode = createRef<Code>();

  // Simple equation layout - starts in center
  view.add(
    <Layout
      ref={simpleLayout}
      layout
      direction={'column'}
      gap={80}
      alignItems={'center'}
    >
      <PolyLatex ref={simpleEquation} tex={'(n + 1)^2 = n^2 + 2n + 1'} fontSize={60} />
      <PolyTxt
        ref={simpleText}
        text={'Simple \\😊/'}
        fontSize={80}
        fill={Solarized.green}
        opacity={0}
      />
    </Layout>,
  );

  view.add(createShadow(simpleText));

  // Complex equation layout - starts off-screen to the right
  view.add(
    <Layout
      ref={complexLayout}
      layout
      direction={'column'}
      gap={80}
      alignItems={'center'}
      opacity={0}
    >
      <PolyLatex
        ref={complexEquation}
        tex={
          '2\\sum_{k=1}^n k^7 = \\left(\\sum_{k=1}^n k\\right)^2 - 3\\left(\\sum_{k=1}^n k^2\\right)^2 + 4\\left(\\sum_{k=1}^n k^3\\right)^2'
        }
        fontSize={50}
      />
      <PolyTxt
        ref={complexText}
        text={'Difficult /😫\\'}
        fontSize={80}
        fill={Solarized.red}
      />
    </Layout>,
  );

  // Start with the simple equation in the center
  // First, show the simple equation
  yield* all(simpleEquation().write(1.5));

  yield* waitFor(0.5);

  // Show the "Simple :)" text
  yield* appear(simpleText);

  yield* waitFor(1);
  view.add(createShadow(complexText));

  // Shift simple equation to the left and bring in the complex equation
  yield* all(
    simpleLayout().position(simpleLayout().position().addX(-1400), 1),
    simpleLayout().scale(0.5, 1),
    complexLayout().position([1600, 0]).position([0, 0], 1),
    complexLayout().scale(0.5).scale(1, 1),
    delay(
      0.5,
      all(
        complexLayout().opacity(1, 0.1),
        complexEquation().write(2),
        complexText().opacity(0).opacity(1, 1),
      ),
    ),
  );

  yield* waitFor(2);

  // Hide the "Difficult" text and show Julia code
  yield* complexText().opacity(0, 0.5, easeInOutCubic);

  // Julia code component
  view.add(
    <Code
      ref={juliaCode}
      highlighter={juliaHighlighter}
      fontSize={32}
      position={[0, 180]}
    />,
  );

  yield* all(
    juliaCode().code(
      `for n in 1:10000
    lhs = 2 * sum((1:n).^7)
    rhs = sum(1:n)^2 - 3*sum((1:n).^2)^2 + 4*sum((1:n).^3)^2

    @assert lhs == rhs
end`,
      1,
    ),
    complexLayout().position(complexLayout().position().addY(-150), 1),
  );

  const highlightRectangle = createRef<Rect>();

  view.add(
    <Rect
      ref={highlightRectangle}
      position={juliaCode().position()}
      width={juliaCode().cacheBBox().expand(20).width}
      height={juliaCode().cacheBBox().expand(20).height}
      stroke={Solarized.gray}
      lineWidth={6}
      lineDash={[20, 10]}
      opacity={0}
      fill={new Color(Solarized.gray).alpha(0.15)}
      zIndex={-1}
    />,
  );

  yield loop(() => highlightRectangle().lineDashOffset(-30, 0.2, linear).to(0, 0));

  const highlightN = createRef<PolyTxt>();
  const highlightCounter = createRef<PolyTxt>();
  const highlightLoader = createRef<PolyTxt>();
  const signalCounter = createSignal(1);

  view.add(
    <Layout
      layout
      direction={'row'}
      gap={20}
      alignItems={'center'}
      justifyContent={'end'}
      right={[550, 260]}
      width={1} // done for right to work
      zIndex={1}
    >
      <PolyTxt ref={highlightN} fontFamily={'monospace'} text={() => `n = `} />
      <PolyTxt
        ref={highlightCounter}
        fontFamily={'monospace'}
        text={() => `${Math.round(signalCounter())}`}
        fill={Solarized.magenta}
      />
      <PolyTxt
        ref={highlightLoader}
        fontFamily={'monospace'}
        text={() => `↻`}
        fontSize={60}
      />
    </Layout>,
  );

  // little disgusting but that's what we're here for
  yield loop(4, () => highlightLoader().rotation(0).rotation(360, 1.1, linear));

  yield* all(
    highlightRectangle().opacity(1, 0.5),
    highlightN().opacity(0).opacity(1, 0.5),
    highlightCounter().opacity(0).opacity(1, 0.5),
    highlightLoader().opacity(0).opacity(0.5, 0.5),
    delay(0.5, signalCounter(10000, 4, linear)),
    all(
      highlightRectangle().stroke(Solarized.green, 4),
      highlightRectangle().fill(new Color(Solarized.green).alpha(0.15), 4),
    ),
    delay(
      4.5,
      all(
        highlightN().opacity(0, 0.01),
        highlightCounter().text('success', 0.01),
        highlightCounter().fill(Solarized.green, 0.01),
        highlightLoader().text('✅️', 0),
      ),
    ),
  );

  yield* waitFor(1);

  yield* all(
    highlightRectangle().opacity(0, 0.5),
    highlightN().opacity(0, 0.5),
    highlightCounter().opacity(0, 0.5),
    highlightLoader().opacity(0, 0.5),
  );

  // === NEW SECTION: Trigonometric Identity ===

  yield* waitFor(1);

  // Fade out the complex equation and code
  // yield* all(complexLayout().opacity(0, 1), juliaCode().opacity(0, 1));

  // Create trigonometric equation layout
  const trigLayout = createRef<Layout>();
  const trigEquation = createRef<PolyLatex>();
  const trigJuliaCode = createRef<Code>();

  view.add(
    <Layout
      ref={trigLayout}
      layout
      direction={'column'}
      gap={80}
      alignItems={'center'}
      opacity={0}
      position={[0, -150]}
    >
      <PolyLatex
        ref={trigEquation}
        tex={
          '\\frac{\\sin(x) + \\sin(3x) + \\sin(5x) + \\sin(7x)}{\\cos(x) + \\cos(3x) + \\cos(5x) + \\cos(7x)} = \\tan(4x)'
        }
        fontSize={55}
      />
    </Layout>,
  );

  yield* all(
    complexLayout().position(complexLayout().position().addX(-1400), 1),
    complexLayout().scale(0.5, 1),
    juliaCode().position(juliaCode().position().addX(-1400), 1),
    juliaCode().scale(0.5, 1),
    trigLayout().position([1600, 0]).position([0, 0], 1),
    trigLayout().scale(0.5).scale(1, 1),
    delay(0.5, all(trigLayout().opacity(1, 0.1), trigEquation().write(2))),
  );

  yield* waitFor(1.5);

  view.add(
    <Code
      ref={trigJuliaCode}
      highlighter={juliaHighlighter}
      fontSize={30}
      position={[0, 180]}
      opacity={0}
    />,
  );

  yield* all(
    trigJuliaCode().opacity(1, 0.5),
    trigJuliaCode().code(
      `using Random

for i in 1:100_000
    x = big(rand())

    lhs = (sin(x) + sin(3x) + sin(5x) + sin(7x)) / (cos(x) + cos(3x) + cos(5x) + cos(7x))
    rhs = tan(4x)

    @assert abs(lhs - rhs) < 1e-16
end`,
      2,
    ),
    trigLayout().position(trigLayout().position().addY(-230), 1),
  );

  // Create highlight rectangle for trig code
  const trigHighlightRect = createRef<Rect>();

  view.add(
    <Rect
      ref={trigHighlightRect}
      position={trigJuliaCode().position()}
      width={trigJuliaCode().cacheBBox().expand(20).width}
      height={trigJuliaCode().cacheBBox().expand(20).height}
      stroke={Solarized.gray}
      lineWidth={6}
      lineDash={[20, 10]}
      opacity={0}
      fill={new Color(Solarized.gray).alpha(0.15)}
      zIndex={-1}
    />,
  );

  yield loop(() => trigHighlightRect().lineDashOffset(-30, 0.2, linear).to(0, 0));

  // Create display for random x values and counter
  const randomXDisplay = createRef<PolyTxt>();
  const trigLoader = createRef<PolyTxt>();
  const xValueSignal = createSignal(0.0);

  view.add(
    <Layout
      layout
      direction={'column'}
      gap={15}
      alignItems={'end'}
      justifyContent={'center'}
      right={[790, 320]}
      width={1}
      zIndex={1}
    >
      <Layout layout direction={'row'} gap={15} alignItems={'center'}>
        <PolyTxt
          ref={randomXDisplay}
          fontFamily={'monospace'}
          text={() =>
            `x = ${xValueSignal() > 0 ? '+' : '–'}${Math.abs(xValueSignal()).toFixed(4)}`
          }
          fill={Solarized.blue}
          opacity={0}
        />
        <PolyTxt
          ref={trigLoader}
          fontFamily={'monospace'}
          text={() => `↻`}
          fontSize={60}
          opacity={0}
        />
      </Layout>
    </Layout>,
  );

  // Animate the verification with random values
  yield loop(5, () => trigLoader().rotation(0).rotation(360, 1, linear));

  let random = useRandom();

  // Generate random-looking x values
  yield* all(
    trigHighlightRect().opacity(1, 0.5),
    randomXDisplay().opacity(1, 0.5),
    trigLoader().opacity(0.5, 0.5),
    // Animate x values changing randomly
    delay(
      0.5,
      loop(45, () =>
        chain(xValueSignal(2 * (random.nextFloat() - 0.5), 0.01), waitFor(0.09)),
      ),
    ),
    all(
      trigHighlightRect().stroke(Solarized.green, 4.5),
      trigHighlightRect().fill(new Color(Solarized.green).alpha(0.15), 4.5),
    ),
    delay(
      5,
      all(
        randomXDisplay().text('success', 0.01),
        randomXDisplay().fill(Solarized.green, 0.01),
        trigLoader().text('✅️', 0),
      ),
    ),
  );

  yield* waitFor(2);

  // Final fade out
  yield* all(
    trigHighlightRect().opacity(0, 1),
    randomXDisplay().opacity(0, 1),
    trigLoader().opacity(0, 1),
    trigLayout().opacity(0, 1),
    trigJuliaCode().opacity(0, 1),
  );

  yield* waitFor(1);
});
