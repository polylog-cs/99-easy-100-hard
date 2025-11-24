import { makeScene2D, Video } from '@motion-canvas/2d';
import { all, createRef, fadeTransition, waitFor } from '@motion-canvas/core';

import kurtzgesagt from '../../assets/kurtzgesagt.mp4';
import mario from '../../assets/mario.mp4';
import {
  animateBullets,
  beginAnnonymousSlide,
  createTwoColumnSlideWithHeader,
  showHeader,
} from '../../utilities/presentation';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);

  const {
    header,
    leftColumnHeader,
    leftBulletRefs,
    leftCircBulletRefs,
    rightColumnHeader,
    rightBulletRefs,
    rightCircBulletRefs,
  } = createTwoColumnSlideWithHeader(
    view,
    { headerText: 'Animations in videos', bulletFontSize: 45 },
    'Hand-crafted',
    ['Beautiful and elegant...', "...if you know what you're doing"],
    'Programmatic',
    ['More suitable for technical videos', 'Limited by the framework'],
  );

  // Wait after fade transition
  yield* waitFor(0.5);

  // Show header
  yield* showHeader(header, 1);

  // Animate left column header
  yield* showHeader(leftColumnHeader);

  // Animate left column bullets
  yield* animateBullets(leftBulletRefs, leftCircBulletRefs);

  yield* beginAnnonymousSlide();

  // Add and play left video
  const leftVideoRef = createRef<Video>();
  view.add(
    <Video
      ref={leftVideoRef}
      src={kurtzgesagt}
      scale={0.35}
      x={-420}
      y={280}
      zIndex={-1}
    />,
  );

  leftVideoRef().play();
  yield* all(
    leftVideoRef().opacity(0).opacity(1, 1),
    waitFor(leftVideoRef().getDuration() - 0.5),
  );
  leftVideoRef().pause();

  yield* beginAnnonymousSlide();

  // Animate right column header
  yield* showHeader(rightColumnHeader);

  // Animate right column bullets
  yield* animateBullets(rightBulletRefs, rightCircBulletRefs);

  yield* beginAnnonymousSlide();

  // Add and play right video
  const rightVideoRef = createRef<Video>();
  view.add(
    <Video ref={rightVideoRef} src={mario} scale={0.35} x={420} y={280} zIndex={-1} />,
  );

  rightVideoRef().play();
  yield* all(
    rightVideoRef().opacity(0).opacity(1, 1),
    waitFor(rightVideoRef().getDuration() - 0.5),
  );
  rightVideoRef().pause();

  yield* beginAnnonymousSlide();
});
