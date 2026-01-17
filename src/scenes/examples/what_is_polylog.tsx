import { makeScene2D } from '@motion-canvas/2d';
import { beginSlide, createRef, waitFor } from '@motion-canvas/core';

import {
  beginAnnonymousSlide,
  createSectionHeader,
  showHeader,
} from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  const title = createRef<PolyTxt>();

  createSectionHeader(view, title, {
    text: 'What is Polylog?',
  });

  // there to make the fade transition not immediately go into the contents
  // this has to be AFTER some elements are created so MC knows what to change into (I think?)
  yield* waitFor(0.5);

  yield* showHeader(title);

  yield* beginAnnonymousSlide();
});
