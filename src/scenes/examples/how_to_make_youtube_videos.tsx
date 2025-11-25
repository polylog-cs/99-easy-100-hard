import { Img, makeScene2D, Video } from '@motion-canvas/2d';
import { all, createRef, fadeTransition, waitFor } from '@motion-canvas/core';

import phone from '../../assets/phone.mp4';
import polylogo from '../../assets/polylogo.mp4';
import videoPracticePng from '../../assets/video-practice.png';
import videoTheoryPng from '../../assets/video-theory.png';
import { Solarized } from '../../utilities/color';
import {
  animateBullets,
  beginAnnonymousSlide,
  createSlideWithHeader,
  showHeader,
} from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);
  view.fill(Solarized.background);

  // there to make the fade transition not immediately go into the contents
  // this has to be AFTER some elements are created so MC knows what to change into (I think?)
  yield* waitFor(0.5);

  const howToMake = createRef<PolyTxt>();
  view.add(<PolyTxt ref={howToMake} text="" fontSize={100} textAlign={'center'} />);
  yield* howToMake().text('How to make YouTube videos', 1);
  yield* beginAnnonymousSlide();
  yield* howToMake().text('How to make YouTube videos\n(according to Polylog)', 1);
  yield* beginAnnonymousSlide();

  yield* howToMake().opacity(0, 0.5);

  const videoTheory = createRef<Img>();
  view.add(
    <Img ref={videoTheory} src={videoTheoryPng} width={view.width()} opacity={0} />,
  );

  yield* videoTheory().opacity(1, 1);

  yield* beginAnnonymousSlide();

  const videoPractice = createRef<Img>();
  view.add(
    <Img ref={videoPractice} src={videoPracticePng} width={view.width()} opacity={0} />,
  );

  yield* all(videoPractice().opacity(1, 1));

  yield* beginAnnonymousSlide();

  yield* all(videoTheory().opacity(0, 1), videoPractice().opacity(0, 1));

  const { header, contentLayout, bulletRefs, circBulletRefs } = createSlideWithHeader(
    view,
    { headerText: 'Good explanations are hard' },
    [
      'In what order to explain things?',
      'What visual language to choose? ',
      'How technical do we want to go?',
      'What do people care about?',
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
  } = createSlideWithHeader(view, { headerText: 'Swept under the carpet' }, [
    'CD checksums: not actually random!\nAdversarial inputs exist, but it’s hard to find them',
    'Quicksort - we shuffle the array,\nin practice people pick a random pivot instead',
    'Issues with duplicate values',
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
