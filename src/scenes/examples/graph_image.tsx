import { Img, makeScene2D } from '@motion-canvas/2d';
import { all, beginSlide, createRef, waitFor } from '@motion-canvas/core';

import graph from '../../assets/graph.png';
import { Solarized } from '../../utilities/color';
import { beginAnnonymousSlide } from '../../utilities/presentation';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const imageRef = createRef<Img>();

  view.add(
    <Img ref={imageRef} src={graph} scale={1.6} position={[0, 0]} opacity={0} />,
  );

  // Fade in the image
  yield* imageRef().opacity(1, 1);

  yield* beginAnnonymousSlide();
});
