import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, createRef, sequence, waitFor } from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import {
  animateBullets,
  beginAnnonymousSlide,
  createSlideWithHeader,
  showHeader,
} from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  yield* beginAnnonymousSlide();

  const { header, contentLayout, bulletRefs, circBulletRefs } = createSlideWithHeader(
    view,
    { headerText: 'When does randomness help?' },
    [
      'generally: protection against the worst-case adversary',
      'equation testing: no known efficient deterministic\nalgorithm',
      'primality testing: deterministic algorithm known (2002),\nbut not used',
    ],
  );

  contentLayout().scale(1.25);

  yield* showHeader(header, 1);

  yield* contentLayout().opacity(1, 0.5);
  yield* animateBullets(bulletRefs, circBulletRefs);

  yield* beginAnnonymousSlide();
});
