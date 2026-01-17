import { Layout, makeScene2D, Node, Rect } from '@motion-canvas/2d';
import { Code } from '@motion-canvas/2d/lib/components';
import {
  all,
  Color,
  createRef,
  createSignal,
  delay,
  linear,
  loop,
  useRandom,
  waitFor,
} from '@motion-canvas/core';

import { ShikiHighlighter } from '../../components/Shiki';
import { Solarized } from '../../utilities/color';
import { PolyLatex } from '../../utilities/latex';
import { beginAnnonymousSlide } from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

// Julia code highlighter
const juliaHighlighter = new ShikiHighlighter({
  highlighter: {
    lang: 'julia',
    theme: 'solarized-light',
  },
});

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);
  yield* beginAnnonymousSlide();
  const camera = <Node />;
  view.add(camera);

  const complicatedLayout = createRef<Layout>();
  const complicatedEquation = createRef<PolyLatex>();

  // Equation layout
  camera.add(
    <Layout
      ref={complicatedLayout}
      layout
      direction={'column'}
      gap={80}
      alignItems={'center'}
      position={[0, -250]}
    >
      <PolyLatex
        ref={complicatedEquation}
        tex={'x^4 + x^3 - x - 1 = (x^2 + x + 1)(x^2 - 1)'}
        fontSize={50}
        scale={1.5}
      />
    </Layout>,
  );

  const algorithmCode = createRef<Code>();

  camera.add(
    <Code
      ref={algorithmCode}
      highlighter={juliaHighlighter}
      fontSize={45}
      position={[-180, 150]}
      code={`for i in range(10):
    x = rand()
    lhs = x**4 + x**3 - x - 1
    rhs = (x**2 + x + 1)*(x**2 - 1)
    if lhs != rhs:
        return False

return True`}
    />,
  );

  const highlightRectangle = createRef<Rect>();

  camera.add(
    <Rect
      ref={highlightRectangle}
      position={algorithmCode().position()}
      width={algorithmCode().cacheBBox().expand(20).width}
      height={algorithmCode().cacheBBox().expand(20).height}
      stroke={Solarized.gray}
      lineWidth={6}
      lineDash={[20, 10]}
      opacity={0}
      fill={new Color(Solarized.gray).alpha(0.15)}
      zIndex={-1}
    />,
  );

  yield* beginAnnonymousSlide();

  yield loop(() => highlightRectangle().lineDashOffset(-30, 0.2, linear).to(0, 0));

  const highlightN = createRef<PolyTxt>();
  const highlightCounter = createRef<PolyTxt>();
  const highlightLoader = createRef<PolyTxt>();
  const highlightTrying = createRef<PolyTxt>();
  const highlightLhs = createRef<PolyTxt>();
  const highlightRhs = createRef<PolyTxt>();
  const signalCounter = createSignal(1);

  const random = useRandom();
  const randomFloats = Array.from({ length: 11 }, () => random.nextFloat());
  const randomFloat = createSignal(() => randomFloats[Math.round(signalCounter())]);
  const lhsValue = createSignal(() => {
    const x = randomFloat();
    return Math.pow(x, 4) + Math.pow(x, 3) - x - 1;
  });
  const rhsValue = createSignal(() => {
    const x = randomFloat();
    return (Math.pow(x, 2) + x + 1) * (Math.pow(x, 2) - 1);
  });

  camera.add(
    <Layout
      layout
      direction={'column'}
      gap={10}
      alignItems={'start'}
      justifyContent={'start'}
      topLeft={[580, 50]}
      zIndex={1}
    >
      <Layout
        layout
        direction={'row'}
        gap={20}
        alignItems={'center'}
        justifyContent={'start'}
      >
        <PolyTxt ref={highlightN} fontFamily={'monospace'} text={() => `i = `} />
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
      </Layout>
      <PolyTxt
        ref={highlightTrying}
        fontFamily={'monospace'}
        text={() => `x = ${randomFloat().toFixed(6)}`}
        fontSize={35}
        opacity={0.5}
      />
      <PolyTxt
        ref={highlightLhs}
        fontFamily={'monospace'}
        text={() => `lhs = ${lhsValue().toFixed(6)}`}
        fontSize={35}
      />
      <PolyTxt
        ref={highlightRhs}
        fontFamily={'monospace'}
        text={() => `rhs = ${rhsValue().toFixed(6)}`}
        fontSize={35}
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
    highlightTrying().opacity(0).opacity(0.5, 0.5),
    highlightLhs().opacity(0).opacity(1, 0.5),
    highlightRhs().opacity(0).opacity(1, 0.5),
    delay(0.5, signalCounter(10, 4, linear)),
    all(
      highlightRectangle().stroke(Solarized.green, 4),
      highlightRectangle().fill(new Color(Solarized.green).alpha(0.15), 4),
    ),
    delay(
      4.5,
      all(
        highlightN().text('', 0.01),
        highlightTrying().opacity(0, 0.01),
        highlightLhs().opacity(0, 0.01),
        highlightRhs().opacity(0, 0.01),
        highlightCounter().text('success', 0.01),
        highlightCounter().fill(Solarized.green, 0.01),
        highlightLoader().text('✅️', 0),
      ),
    ),
  );

  yield* waitFor(5);

  yield* beginAnnonymousSlide();
});
