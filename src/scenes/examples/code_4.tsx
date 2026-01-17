import { Circle, insert, Layout, lines, Rect } from '@motion-canvas/2d';
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
import shader from '../../shaders/shader.glsl';
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

// Code highlighter for GLSL
const glslHighlighter = new ShikiHighlighter({
  highlighter: {
    lang: 'glsl',
    theme: 'solarized-light',
  },
});

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  let tsCode = createRef<Code>();
  let glslCode = createRef<Code>();
  let tsCodeBackground = createRef<Rect>();
  let glslCodeBackground = createRef<Rect>();
  let headerRef = createRef<PolyTxt>();

  yield* waitFor(0.5);

  // // Create and show header
  // createSectionHeader(view, headerRef, {
  //   text: 'Shaders',
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

  // TypeScript code on top
  view.add(
    <Rect
      layout
      ref={tsCodeBackground}
      topLeft={new Vector2(-400, -130)}
      fill={Solarized.base3}
      lineWidth={2}
      radius={30}
      lineDash={[30, 10]}
      scale={1.14}
    >
      <Code highlighter={tsHighlighter} fontSize={24} ref={tsCode} />
    </Rect>,
  );

  // GLSL code on bottom
  view.add(
    <Rect
      layout
      ref={glslCodeBackground}
      topLeft={new Vector2(-400, 250)}
      fill={Solarized.base3}
      lineWidth={2}
      radius={30}
      lineDash={[30, 10]}
      scale={0.97}
    >
      <Code highlighter={glslHighlighter} fontSize={24} ref={glslCode} />
    </Rect>,
  );

  // Start with both code sections
  yield* all(
    tsCodeBackground().padding(0).padding(25, 1),
    glslCodeBackground().padding(0).padding(25, 1),
    tsCode().code(
      `\
const circle = createRef<Circle>();

view.add(
    <Circle
        size={400} lineWidth={50}
        ref={circle} shaders={shader}
        fill={'rgb(255,0,0)'}
        stroke={'rgba(200,0,0,0.5)'}
    />
);

yield* waitFor(3);`,
      1,
    ),
    glslCode().code(
      `\
outColor = texture(sourceTexture, sourceUV);

vec3 col = 0.5 + 0.5 * cos(time * 3.0
    + sourceUV.xyx + vec3(0, 2, 4));

outColor.rgb = col;`,
      1,
    ),
  );

  yield* beginAnnonymousSlide();

  // Create the circle object that will be animated
  const circle = createRef<Circle>();

  // Dummy shader code (we'll just simulate the visual effect)
  const shaderTime = createSignal(0);

  view.add(
    <Circle
      ref={circle}
      size={500}
      lineWidth={50}
      opacity={0}
      scale={0}
      x={400}
      fill={'rgb(255,0,0)'}
      stroke={'rgba(200,0,0,0.5)'}
      shaders={{
        fragment: shader,
        uniforms: {
          intensity: 0,
        },
      }}
    />,
  );

  yield loop(() =>
    tsCodeBackground().lineDashOffset(0).lineDashOffset(40, 0.25, linear),
  );
  yield loop(() =>
    glslCodeBackground().lineDashOffset(0).lineDashOffset(40, 0.25, linear),
  );

  yield* all(
    tsCodeBackground().lineWidth(0).lineWidth(5, 0.5),
    tsCodeBackground().stroke(Solarized.gray, 0.5),
    glslCodeBackground().lineWidth(0).lineWidth(5, 0.5),
    glslCodeBackground().stroke(Solarized.gray, 0.5),
  );

  // Animate the circle appearing with shader effect
  yield* all(circle().opacity(1, 1), circle().scale(1, 1));

  yield* beginAnnonymousSlide();

  // Fade out
  yield* all(circle().opacity(0, 1), circle().scale(0, 1));

  yield* all(
    tsCodeBackground().lineWidth(0, 0.5),
    tsCodeBackground().stroke(Solarized.base1, 0.5),
    glslCodeBackground().lineWidth(0, 0.5),
    glslCodeBackground().stroke(Solarized.base1, 0.5),
  );

  yield* beginAnnonymousSlide();
});
