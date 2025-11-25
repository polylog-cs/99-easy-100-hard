import { Img, makeScene2D } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  fadeTransition,
  waitFor,
} from '@motion-canvas/core';

import grantLogo from '../../assets/grant_logo.png';
import grant from '../../assets/grant.png';
import { Solarized } from '../../utilities/color';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);

  view.fill(Solarized.background);

  yield* waitFor(0.5);

  const imageRef = createRef<Img>();
  const logoRef = createRef<Img>();

  view.add(
    <>
      <Img ref={imageRef} src={grant} scale={1} position={[0, 0]} opacity={0} />
      <Img ref={logoRef} src={grantLogo} scale={1} position={[430, -300]} opacity={0} />
    </>,
  );

  // Fade in both images at the same time
  yield* all(imageRef().opacity(1, 1), logoRef().opacity(1, 1));

  yield* beginSlide('grant image end');
});
