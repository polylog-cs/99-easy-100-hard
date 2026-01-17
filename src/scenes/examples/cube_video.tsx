import { makeScene2D, Video } from '@motion-canvas/2d';
import { all, beginSlide, createRef, waitFor } from '@motion-canvas/core';

import cube from '../../assets/cube.mp4';
import { Solarized } from '../../utilities/color';
import { beginAnnonymousSlide } from '../../utilities/presentation';

export default makeScene2D(function* (view) {
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

  yield* beginAnnonymousSlide();
});
