import { makeScene2D, Video } from '@motion-canvas/2d';
import { all, createRef, waitFor } from '@motion-canvas/core';

import phone from '../../assets/phone.mp4';
import polylogo from '../../assets/polylogo.mp4';
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

  // there to make the fade transition not immediately go into the contents
  // this has to be AFTER some elements are created so MC knows what to change into (I think?)
  yield* waitFor(0.5);

  const whyAreYou = createRef<PolyTxt>();
  view.add(<PolyTxt ref={whyAreYou} text="" fontSize={100} />);
  yield* whyAreYou().text('Why are you not making videos?', 1);
  yield* beginAnnonymousSlide();
  yield* whyAreYou().opacity(0, 0.5);

  const { header, contentLayout, bulletRefs, circBulletRefs } = createSlideWithHeader(
    view,
    { headerText: "It's not good enough" },
    [
      "Startup version: “If you are not embarrassed by the first\nversion of your product, you've launched too late”",
      'Don’t guess what matters, show it to people instead',
      '– Polylog beta versions',
      'Use deadlines; Summer of Math Exposiiton',
    ],
  );

  contentLayout().scale(1.25);

  yield* showHeader(header, 1);

  yield* contentLayout().opacity(1, 0.5);
  yield* animateBullets(bulletRefs, circBulletRefs);

  yield* beginAnnonymousSlide();

  const {
    header: header2,
    contentLayout: contentLayout2,
    bulletRefs: bulletRefs2,
    circBulletRefs: circBulletRefs2,
  } = createSlideWithHeader(view, { headerText: "I'm afraid to share things" }, [
    'Stand by your work',
    'Or: If it’s not good, nobody will see it',
    'Moving away helps',
    'Being vulnerable is hard',
    'To be cringe is to be free',
  ]);

  // there to make the fade transition not immediately go into the contents
  // this has to be AFTER some elements are created so MC knows what to change into (I think?)

  yield* all(contentLayout().opacity(0, 0.5), header().opacity(0, 0.5));

  yield* showHeader(header2, 1);

  contentLayout2().scale(1.3);

  yield* contentLayout2().opacity(1, 0.5);
  yield* animateBullets(bulletRefs2, circBulletRefs2);

  yield* beginAnnonymousSlide();
});
