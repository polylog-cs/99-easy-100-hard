import { Layout, makeScene2D } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  Direction,
  finishScene,
  slideTransition,
  waitFor,
} from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { beginAnnonymousSlide } from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const title1 = createRef<PolyTxt>();
  const title2 = createRef<PolyTxt>();
  const subtitleLayout = createRef<Layout>();

  view.add(
    <>
      <PolyTxt ref={title1} text={''} fontSize={120} position={[21, -220]} />
      <PolyTxt ref={title2} text={''} fontSize={120} position={[0, -90]} />
      <Layout
        ref={subtitleLayout}
        layout
        direction={'column'}
        gap={10}
        alignItems={'center'}
        position={[0, 200]}
        opacity={0}
      >
        <PolyTxt text={'Richard Hladík'} fontSize={60} />
        <PolyTxt text={'Tomáš Sláma'} fontSize={60} />
        <PolyTxt text={'Václav Volhejn'} fontSize={60} />
        <PolyTxt text={'Polylog @ AvailabilIT'} fill={Solarized.base1} fontSize={80} />
      </Layout>
    </>,
  );

  yield* beginAnnonymousSlide();

  // Animate title appearance using text()
  yield* title1().text('99% is easy', 1);
  yield* waitFor(0.3);
  yield* title2().text('100% is hard', 1);

  yield* beginAnnonymousSlide();

  yield* subtitleLayout().opacity(1, 1);

  yield* beginAnnonymousSlide();
});
