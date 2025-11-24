import { makeScene2D, Video } from '@motion-canvas/2d';
import { all, createRef, fadeTransition, waitFor } from '@motion-canvas/core';

import kurtzgesagt from '../../assets/kurtzgesagt.mp4';
import mario from '../../assets/mario.mp4';
import { Solarized } from '../../utilities/color';
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

  yield* beginAnnonymousSlide();

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
      lineWidth={50}
      stroke={Solarized.gray}
      scale={0.7}
      x={0}
      y={0}
      zIndex={10}
      opacity={0}
    />,
  );

  leftVideoRef().play();

  // Fade in video and reduce visibility of other elements
  yield* all(
    leftVideoRef().opacity(1, 1),
    header().opacity(0.2, 1),
    leftColumnHeader().opacity(0.2, 1),
    ...leftBulletRefs.map((ref) => ref().opacity(0.2, 1)),
    ...leftCircBulletRefs.map((ref) => ref().opacity(0.2, 1)),
    waitFor(leftVideoRef().getDuration() - 0.5),
  );

  leftVideoRef().pause();

  yield* beginAnnonymousSlide();

  // Move video to final position and restore other elements
  yield* all(
    leftVideoRef().scale(0.35, 1),
    leftVideoRef().x(-420, 1),
    leftVideoRef().y(280, 1),
    header().opacity(1, 1),
    leftColumnHeader().opacity(1, 1),
    ...leftBulletRefs.map((ref) => ref().opacity(1, 1)),
    ...leftCircBulletRefs.map((ref) => ref().opacity(1, 1)),
  );

  yield* beginAnnonymousSlide();

  // Animate right column header
  yield* showHeader(rightColumnHeader);

  // Animate right column bullets
  yield* animateBullets(rightBulletRefs, rightCircBulletRefs);

  yield* beginAnnonymousSlide();

  // Add and play right video
  const rightVideoRef = createRef<Video>();
  view.add(
    <Video
      ref={rightVideoRef}
      lineWidth={50}
      stroke={Solarized.gray}
      src={mario}
      scale={0.7}
      x={0}
      y={0}
      zIndex={10}
      opacity={0}
    />,
  );

  rightVideoRef().play();

  // Fade in video and reduce visibility of other elements
  yield* all(
    rightVideoRef().opacity(1, 1),
    header().opacity(0.2, 1),
    leftColumnHeader().opacity(0.2, 1),
    ...leftBulletRefs.map((ref) => ref().opacity(0.2, 1)),
    ...leftCircBulletRefs.map((ref) => ref().opacity(0.2, 1)),
    rightColumnHeader().opacity(0.2, 1),
    ...rightBulletRefs.map((ref) => ref().opacity(0.2, 1)),
    ...rightCircBulletRefs.map((ref) => ref().opacity(0.2, 1)),
    leftVideoRef().opacity(0.2, 1),
    waitFor(rightVideoRef().getDuration() - 0.5),
  );

  rightVideoRef().pause();

  yield* beginAnnonymousSlide();

  // Move video to final position and restore other elements
  yield* all(
    rightVideoRef().scale(0.35, 1),
    rightVideoRef().x(420, 1),
    rightVideoRef().y(280, 1),
    header().opacity(1, 1),
    leftColumnHeader().opacity(1, 1),
    ...leftBulletRefs.map((ref) => ref().opacity(1, 1)),
    ...leftCircBulletRefs.map((ref) => ref().opacity(1, 1)),
    rightColumnHeader().opacity(1, 1),
    ...rightBulletRefs.map((ref) => ref().opacity(1, 1)),
    ...rightCircBulletRefs.map((ref) => ref().opacity(1, 1)),
    leftVideoRef().opacity(1, 1),
  );

  yield* beginAnnonymousSlide();
});
