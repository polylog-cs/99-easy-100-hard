import { Img, makeScene2D } from '@motion-canvas/2d';
import { all, createRef, fadeTransition, waitFor } from '@motion-canvas/core';

import cubeVideo from '../../assets/cube_video.png';
import { Solarized } from '../../utilities/color';
import {
  beginAnnonymousSlide,
  createSectionHeader,
  showHeader,
} from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);

  view.fill(Solarized.background);

  const title = createRef<PolyTxt>();
  const imageRef = createRef<Img>();

  createSectionHeader(view, title, {
    text: 'Views, 6 months after publishing',
  });

  title().fontSize(100);
  title().textAlign('center');
  title().y(200);

  view.add(
    <Img ref={imageRef} src={cubeVideo} scale={1.1} position={[0, -150]} opacity={0} />,
  );

  // there to make the fade transition not immediately go into the contents
  // this has to be AFTER some elements are created so MC knows what to change into (I think?)
  yield* waitFor(0.5);

  yield* all(showHeader(title), imageRef().opacity(1, 1));

  yield* beginAnnonymousSlide();

  yield* title().text('Views, 6 months after publishing\n795', 1);
  yield* beginAnnonymousSlide();
  yield* title().text('Views, 9 months after publishing\n841', 1);
  yield* beginAnnonymousSlide();
  yield* title().text('Views, 9 months after publishing\n841 000', 1);

  yield* beginAnnonymousSlide();
});
