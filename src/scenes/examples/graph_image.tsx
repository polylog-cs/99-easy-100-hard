import { Img, makeScene2D } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  fadeTransition,
  waitFor,
} from '@motion-canvas/core';

import graph from '../../assets/graph.png';
import { Solarized } from '../../utilities/color';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);

  view.fill(Solarized.background);

  const imageRef = createRef<Img>();

  view.add(
    <Img ref={imageRef} src={graph} scale={1.4} position={[0, 0]} opacity={0} />,
  );

  // Fade in the image
  yield* imageRef().opacity(1, 1);

  yield* beginSlide('graph image end');
});
