import { makeScene2D, Video } from '@motion-canvas/2d';
import { all, createRef, fadeTransition, waitFor } from '@motion-canvas/core';

import phone from '../../assets/phone.mp4';
import polylogo from '../../assets/polylogo.mp4';
import {
  animateBullets,
  beginAnnonymousSlide,
  createSlideWithHeader,
  showHeader,
} from '../../utilities/presentation';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);

  const { header, contentLayout, bulletRefs, circBulletRefs } = createSlideWithHeader(
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

  yield* animateBullets(bulletRefs, circBulletRefs);

  yield* beginAnnonymousSlide();

  yield* all(
    header().y(header().y() - 400, 1),
    contentLayout().y(contentLayout().y() - 250, 1),
  );

  const phoneRef = createRef<Video>();
  view.add(
    <Video ref={phoneRef} src={phone} scale={0.8} x={-350} y={180} zIndex={-1} />,
  );

  phoneRef().play();
  yield* waitFor(phoneRef().getDuration() - 0.5);
  phoneRef().pause();

  yield* beginAnnonymousSlide();

  const polylogRef = createRef<Video>();
  view.add(
    <Video ref={polylogRef} src={polylogo} scale={0.56} x={350} y={180} zIndex={-1} />,
  );

  polylogRef().play();
  yield* all(
    waitFor(polylogRef().getDuration() - 0.5),
    polylogRef().opacity(0).opacity(1, 1),
  );
  polylogRef().pause();

  yield* beginAnnonymousSlide();
});
