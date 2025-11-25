import { Circle, Img, Layout, makeScene2D, Node, Rect } from '@motion-canvas/2d';
import { Code } from '@motion-canvas/2d/lib/components';
import {
  all,
  beginSlide,
  chain,
  Color,
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  fadeTransition,
  linear,
  loop,
  sequence,
  useRandom,
  waitFor,
} from '@motion-canvas/core';

import cdEquationsComparisonPng from '../../assets/cd-equations-comparison.png';
import desmosPlotWrongEquation from '../../assets/desmos-plot-wrong-equation.png';
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
  yield fadeTransition(0.5);

  view.fill(Solarized.background);
  yield* beginSlide('simple equation');
  const camera = <Node />;
  view.add(camera);

  const simpleLayout = createRef<Layout>();
  const simpleEquation = createRef<PolyLatex>();
  const simpleText = createRef<PolyTxt>();

  // Simple equation layout - starts in center
  camera.add(
    <Layout
      ref={simpleLayout}
      layout
      direction={'column'}
      gap={80}
      alignItems={'center'}
    >
      <PolyLatex
        ref={simpleEquation}
        tex={'{{(x - 1)}}^2 = {{x^2}} - 2{{x}} + {{1}}'}
        fontSize={80}
      />
      <PolyTxt
        ref={simpleText}
        text={'Simple \\😊/'}
        fontSize={80}
        fill={Solarized.green}
        opacity={0}
      />
    </Layout>,
  );

  camera.add(createShadow(simpleText));

  // Start with the simple equation in the center
  // First, show the simple equation
  yield* all(simpleEquation().write(1.5));

  yield* waitFor(0.5);

  // Show the "Simple :)" text
  yield* appear(simpleText);

  yield* waitFor(1);

  yield* beginSlide('equation 2');

  // (x - 1)^3 = x^3 + 3x^2 - 3x - 1
  yield* all(
    simpleEquation().tex('{{(x - 1)}}^3 = {{x^3}} + 3{{x^2}} - 3{{x}} - {{1}}', 1),
    // simpleText().opacity(0, 1),
    simpleText().text('?', 1),
  );

  yield* beginSlide('equation 2 is wrong');

  const equation2Wrong = createRef<Node>();

  camera.add(
    <Node opacity={0} ref={equation2Wrong}>
      <Circle stroke={Solarized.red} size={100} lineWidth={5} position={[15, -80]} />
      <Circle stroke={Solarized.red} size={100} lineWidth={5} position={[275, -80]} />
    </Node>,
  );

  yield* all(
    simpleEquation().tex('{{(x - 1)}}^3 = {{x^3}} + 3{{x^2}} - 3{{x}} - {{1}}', 1),
    // simpleText().opacity(0, 1),
    simpleText().text("Doesn't hold", 1),
    simpleText().fill(Solarized.red, 1),
    equation2Wrong().opacity(1, 1),
  );

  yield* beginSlide('complicated equation');

  const complicatedLayout = createRef<Layout>();
  const complicatedEquation = createRef<PolyLatex>();
  const complicatedText = createRef<PolyTxt>();

  // complicated equation layout - starts off-screen to the right
  camera.add(
    <Layout
      ref={complicatedLayout}
      layout
      direction={'column'}
      gap={80}
      alignItems={'center'}
      opacity={0}
    >
      <PolyLatex
        ref={complicatedEquation}
        tex={
          '(x^2-{{3}})({{x^6}}+{{x^2}}+1) {{= x^2 (x^2 ((x^2 - 3) x^2 + 1) - 2) - 3}}'
        }
        fontSize={50}
      />
      <PolyTxt
        ref={complicatedText}
        text={'2'}
        fontSize={80}
        fill={Solarized.blue}
        opacity={0}
      />
    </Layout>,
  );

  // Shift simple equation to the left and bring in the complicated equation
  yield* all(
    equation2Wrong().opacity(0, 0.5),
    equation2Wrong().position(equation2Wrong().position().addX(-1400), 1),
    simpleLayout().position(simpleLayout().position().addX(-1400), 1),
    simpleLayout().scale(0.5, 1),
    complicatedLayout().position([1600, 0]).position([0, 0], 1),
    complicatedLayout().scale(0.5).scale(1, 1),
    delay(
      0.5,
      all(complicatedLayout().opacity(1, 0.1), complicatedEquation().write(2)),
    ),
  );

  yield* beginSlide('complicated equation expanded');

  yield* complicatedEquation().tex(
    'x^8 - {{3}} {{x^6}} + x^4 - 2 {{x^2}} - {{3}} {{= x^2 (x^2 ((x^2 - 3) x^2 + 1) - 2) - 3}}',
    1,
  );
  yield* beginSlide('complicated equation expanded 2');

  // Make the groups only on the right side to make the movement clearer
  complicatedEquation().tex(
    'x^8 - 3 x^6 + x^4 - 2 x^2 - 3 {{=}} x^2 (x^2 (({{x^2}} - {{3}}) {{x^2}} + 1) {{- 2}}) {{- 3}}',
  );

  yield* complicatedEquation().tex(
    'x^8 - 3 x^6 + x^4 - 2 x^2 - 3 {{=}} x^8 - {{3}} x^6 + x^4 {{- 2}} {{x^2}} {{- 3}}',
    1,
  );

  yield* beginSlide('complicated equation check');

  const check = createRef<PolyTxt>();
  view.add(<PolyTxt ref={check} text={'✅'} fontSize={150} opacity={0} y={100} />);
  yield* all(check().opacity(0).opacity(1, 1), check().scale(2).scale(1, 1));

  yield* beginSlide('exponential growth of equation');

  yield* all(
    check().opacity(0, 1),
    check().scale(2, 1),
    complicatedEquation().scale(2, 1),
    complicatedEquation().tex('{{(x-2)^7}}', 1),
  );

  yield* beginSlide('exponential growth of equation p2');

  yield* sequence(
    0.2,
    complicatedEquation().scale(1, 1),
    complicatedEquation().tex(
      '{{(x-2)^7}} = x^7 - 14 x^6 + 84 x^5 - 280 x^4 + 560 x^3 - 672 x^2 + 448 x - 128',
      1,
    ),
  );

  yield* beginSlide('random algorithm example');

  yield* all(
    complicatedEquation().tex(
      'x{{^4}} {{+ 3}}x {{- 1}} = (x{{^2}}  + x{{ + 1)(}}x{{^2}} {{- 1)}}',
      1,
    ),
    complicatedEquation().scale(1.5, 1),
  );

  yield* beginSlide('random algorithm example p2');
  yield* all(complicatedText().text('Try x = 2', 1), complicatedText().opacity(1, 1));

  yield* complicatedEquation().tex(
    '2{{^4}} {{+ 3}} \\cdot 2 {{- 1}} {{=}} (2{{^2}} + 2 {{+ 1)(}}2{{^2}} {{- 1)}}',
    1,
  );

  yield* waitFor(1);

  yield* all(
    complicatedEquation().tex('21 {{=}} 21', 1),
    complicatedText().fill(Solarized.green, 1),
    complicatedText().text('Success', 1),
  );

  yield* waitFor(1);

  yield* beginSlide('random algorithm example, plug 3');

  yield* complicatedText().opacity(0, 1);
  yield* all(
    complicatedEquation().tex(
      'x{{^4}} {{+ 3}}x {{- 1}} = (x{{^2}}  + x{{ + 1)(}}x{{^2}} {{- 1)}}',
      1,
    ),
  );
  complicatedText().text('Try x = 3');
  complicatedText().fill(Solarized.blue);
  yield* complicatedText().opacity(1, 1);

  yield* all(
    complicatedEquation().tex(
      '3{{^4}} {{+ 3}}\\cdot 3 {{- 1}} = (3{{^2}}  + 3 {{+ 1)(}}3{{^2}} {{- 1)}}',
      1,
    ),
    complicatedText().text('Try x = 3', 1),
    complicatedText().fill(Solarized.blue, 1),
  );

  yield* waitFor(1);

  yield* all(
    complicatedEquation().tex('89 {{\\neq}} 104', 1),
    complicatedText().fill(Solarized.red, 1),
    complicatedText().text('Nope', 1),
  );

  yield* beginSlide('picking random is ok');

  const desmosPlot = createRef<Img>();
  camera.add(
    <Img
      ref={desmosPlot}
      src={desmosPlotWrongEquation}
      scale={0.7}
      position={[50, 0]}
      opacity={0}
    />,
  );
  yield* desmosPlot().opacity(1, 1);

  yield* beginSlide('equation algorithm no code');

  yield* all(
    desmosPlot().opacity(0, 1),
    complicatedEquation().tex(
      'x{{^4}} {{+ 3}}x {{- 1}} = (x{{^2}}  + x{{ + 1)(}}x{{^2}} {{- 1)}}',
      0.001,
    ),
    complicatedText().opacity(0, 0.001),
  );

  const algorithmCode = createRef<Code>();

  camera.add(
    <Code
      ref={algorithmCode}
      highlighter={juliaHighlighter}
      fontSize={45}
      position={[-100, 180]}
    />,
  );

  yield* beginSlide('equation algorithm with code');

  yield* all(
    algorithmCode().code(
      `for i in range(10):
    x = rand()
    lhs = x**4 + 3*x - 1
    rhs = (x**2 + x + 1)*(x**2 - 1)
    if lhs != rhs:
        return False

return True`,
      1,
    ),
    complicatedLayout().position(complicatedLayout().position().addY(-150), 1),
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

  yield* beginSlide('code running');

  yield loop(() => highlightRectangle().lineDashOffset(-30, 0.2, linear).to(0, 0));

  const highlightN = createRef<PolyTxt>();
  const highlightCounter = createRef<PolyTxt>();
  const highlightLoader = createRef<PolyTxt>();
  const signalCounter = createSignal(1);

  camera.add(
    <Layout
      layout
      direction={'row'}
      gap={20}
      alignItems={'center'}
      justifyContent={'end'}
      right={[800, 260]}
      width={1} // done for right to work
      zIndex={1}
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
    </Layout>,
  );

  // little disgusting but that's what we're here for
  yield loop(4, () => highlightLoader().rotation(0).rotation(360, 1.1, linear));

  yield* all(
    highlightRectangle().opacity(1, 0.5),
    highlightN().opacity(0).opacity(1, 0.5),
    highlightCounter().opacity(0).opacity(1, 0.5),
    highlightLoader().opacity(0).opacity(0.5, 0.5),
    delay(0.5, signalCounter(10, 4, linear)),
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

  yield* beginSlide('comparison table');

  const cdEquationsComparison = createRef<Img>();
  view.add(
    <Img
      ref={cdEquationsComparison}
      src={cdEquationsComparisonPng}
      scale={1}
      opacity={0}
    />,
  );
  yield* all(cdEquationsComparison().opacity(1, 1));

  yield* beginSlide('equations end');
});
