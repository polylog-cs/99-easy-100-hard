import { makeScene2D } from '@motion-canvas/2d';
import { createRef } from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { beginAnnonymousSlide } from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const text = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      ref={text}
      text=""
      fill={Solarized.gray}
      fontSize={100}
      position={[0, 0]}
    />,
  );

  yield* text().text('Randomness + worst case?', 1);

  yield* beginAnnonymousSlide();

  yield* text().text('Worst-case luck (good) vs\nworst-case input (bad)', 1);

  yield* beginAnnonymousSlide();
});
