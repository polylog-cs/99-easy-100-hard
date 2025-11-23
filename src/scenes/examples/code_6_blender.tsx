import { Circle, makeScene2D, Rect } from '@motion-canvas/2d';
import {
  all,
  Color,
  createRef,
  createSignal,
  easeInOutExpo,
  fadeTransition,
  loop,
  sequence,
  Vector2,
} from '@motion-canvas/core';

import shader from '../../shaders/blend.glsl';
import { Solarized } from '../../utilities/color';
import { beginAnnonymousSlide } from '../../utilities/presentation';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);

  view.fill(Solarized.background);

  const circle = createRef<Circle>();
  const square = createRef<Rect>();

  view.add(
    <>
      <Circle
        size={300}
        lineWidth={30}
        ref={circle}
        fill={Solarized.red}
        stroke={new Color(Solarized.red).brighten(0.3)}
        x={-300}
        scale={0}
        opacity={0}
      />
      ,
      <Rect
        size={300}
        lineWidth={30}
        ref={square}
        fill={Solarized.blue}
        stroke={new Color(Solarized.blue).brighten(0.3)}
        x={300}
        scale={0}
        opacity={0}
      />
      <Rect
        width={1920}
        height={1080}
        shaders={{
          fragment: shader,
          // notice that they are signals!
          uniforms: {
            aPos: circle().position,
            aOpacity: circle().opacity,
            aScale: circle().scale,
            aColor: new Color(Solarized.red),
            bPos: square().position,
            bOpacity: square().opacity,
            bScale: square().scale,
            bColor: new Color(Solarized.blue),
          },
        }}
        zIndex={-1}
      />
    </>,
  );

  yield* sequence(
    0.5,
    all(circle().scale(1, 1), circle().opacity(1, 1)),
    all(square().scale(1, 1), square().opacity(1, 1)),
  );

  // alternate sizes of object A and object B
  yield loop(() => circle().scale(0.5, 1).to(1, 1));
  yield loop(() => square().scale(1, 1).to(0.5, 1));

  // rotate a few times around origin
  let progress = createSignal(0);

  circle().position(() => Vector2.fromRadians(progress()).mul(-300));
  square().position(() => Vector2.fromRadians(progress()).mul(300));
  square().rotation(() => square().position().degrees);

  yield* progress(2 * Math.PI, 5, easeInOutExpo);

  yield* beginAnnonymousSlide();
});
