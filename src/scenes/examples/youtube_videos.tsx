import { makeScene2D } from '@motion-canvas/2d';
import { beginSlide, fadeTransition, waitFor } from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { createTwoLineSectionHeader, showHeader } from '../../utilities/presentation';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);

  const { title1, title2 } = createTwoLineSectionHeader(view, {
    text1: 'How to make YouTube videos',
    text2: '(according to Polylog)',
  });

  yield* waitFor(0.5);

  title2().opacity(0);

  // Animate first line appearing
  yield* showHeader(title1);

  yield* beginSlide('youtube-title-2');

  // Animate second line appearing
  yield* title2().opacity(1, 0.5);

  yield* beginSlide('youtube-end');
});
