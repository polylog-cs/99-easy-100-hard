import { makeScene2D } from '@motion-canvas/2d';
import { beginSlide, createRef } from '@motion-canvas/core';

import { PolyTxt } from '../../utilities/text';
import {
  animateBullets,
  showHeader,
  createSectionHeader,
  createSlideWithHeader,
} from '../../utilities/presentation';

export default makeScene2D(function* (view) {
  // Section header slide
  const sectionTitle = createRef<PolyTxt>();

  createSectionHeader(view, sectionTitle, {
    text: 'How to make YouTube videos (according to Polylog)',
  });

  yield* beginSlide('youtube-section-title');

  yield* showHeader(sectionTitle);

  yield* beginSlide('youtube-process-content');

  // Process timeline slide
  const bulletPoints = [
    'Find a topic',
    'Write a script, internal feedback        1 week',
    'Beta version, external feedback        2 days',
    'Create animations                            2 weeks',
    'Record, edit video                            1 week',
  ];

  const { header, contentLayout, bulletRefs } = createSlideWithHeader(
    view,
    { headerText: 'How to make YouTube videos (according to Polylog)' },
    bulletPoints,
  );

  yield* showHeader(header)');

  yield* contentLayout().opacity(1, 0.5);

  yield* animateBullets(bulletRefs, bulletPoints, 'youtube-bullet');

  yield* beginSlide('youtube-process-end');
});
