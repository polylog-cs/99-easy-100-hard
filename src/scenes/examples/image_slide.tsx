import { Img, makeScene2D } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  fadeTransition,
  waitFor,
} from '@motion-canvas/core';

import polylogYoutube from '../../assets/polylog_youtube.png';
import { Solarized } from '../../utilities/color';
import { beginAnnonymousSlide } from '../../utilities/presentation';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);

  view.fill(Solarized.background);

  yield* waitFor(0.5);

  const imageRef = createRef<Img>();

  view.add(
    <Img
      ref={imageRef}
      src={polylogYoutube}
      scale={1.4}
      position={[0, 0]}
      opacity={0}
    />,
  );

  // Fade in the image
  yield* imageRef().opacity(1, 1);

  yield* beginAnnonymousSlide();
});
