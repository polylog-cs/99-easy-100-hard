import { makeScene2D } from '@motion-canvas/2d';
import { fadeTransition, waitFor } from '@motion-canvas/core';

import {
  animateBullets,
  beginAnnonymousSlide,
  createSlideWithHeader,
  showHeader,
} from '../../utilities/presentation';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);

  const { header, contentLayout, bulletRefs } = createSlideWithHeader(
    view,
    { headerText: 'Motion Canvas' },
    [
      'TypeScript-XML framework for creating programmatic animations',
      'Created by aarthificial for animating devlogs',
      'Contains an interactive editor (looking at you, Manim)',
    ],
  );

  // there to make the fade transition not immediately go into the contents
  // this has to be AFTER some elements are created so MC knows what to change into (I think?)
  yield* waitFor(0.5);

  yield* showHeader(header, 1);

  yield* contentLayout().opacity(1, 0.5);

  yield* animateBullets(bulletRefs);

  yield* beginAnnonymousSlide();
});
