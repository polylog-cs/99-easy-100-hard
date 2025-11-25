import { makeScene2D, Video } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  fadeTransition,
  waitFor,
} from '@motion-canvas/core';

import cube from '../../assets/cube.mp4';
import { Solarized } from '../../utilities/color';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);

  view.fill(Solarized.background);

  yield* waitFor(0.5);

  const videoRef = createRef<Video>();

  view.add(<Video ref={videoRef} src={cube} scale={1} position={[0, 0]} />);

  videoRef().play();
  yield* all(
    videoRef().opacity(0).opacity(1, 1),
    waitFor(videoRef().getDuration() - 0.5),
  );
  videoRef().pause();

  yield* beginSlide('cube video end');
});
