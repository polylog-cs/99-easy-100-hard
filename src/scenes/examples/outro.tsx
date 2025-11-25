import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, createRef, fadeTransition, sequence, waitFor } from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { beginAnnonymousSlide } from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);
  view.fill(Solarized.background);

  const lefter = createRef<Layout>();
  const left = createRef<Layout>();
  const right = createRef<Layout>();
  const headerLeft = createRef<PolyTxt>();
  const headerRight = createRef<PolyTxt>();
  view.add(
    <Layout layout direction={'row'} gap={150}>
      <Layout direction={'column'} alignItems="center" ref={lefter}>
        <PolyTxt text="|" fontSize={70} fontWeight="bold" opacity={0} />
        <PolyTxt text="equality testing" fontSize={70} opacity={0} />
        <PolyTxt text="text" fontSize={70} opacity={0} />
        <PolyTxt text="text" fontSize={70} opacity={0} />
        <PolyTxt text="text" fontSize={70} opacity={0} />
      </Layout>
      <Layout direction={'column'} alignItems="center" ref={left}>
        <PolyTxt ref={headerLeft} text="randomized" fontSize={70} fontWeight="bold" />
        <PolyTxt text="text" fontSize={70} opacity={0} />
        <PolyTxt text="text" fontSize={70} opacity={0} />
        <PolyTxt text="text" fontSize={70} opacity={0} />
        <PolyTxt text="text" fontSize={70} opacity={0} />
      </Layout>
      <Layout direction={'column'} alignItems="center" ref={right}>
        <PolyTxt
          ref={headerRight}
          text="deterministic"
          fontSize={70}
          fontWeight="bold"
        />
        <PolyTxt text="text" fontSize={70} opacity={0} />
        <PolyTxt text="text" fontSize={70} opacity={0} />
        <PolyTxt text="text" fontSize={70} opacity={0} />
        <PolyTxt text="text" fontSize={70} opacity={0} />
      </Layout>
    </Layout>,
  );

  for (let i = 1; i <= 4; i++) {
    yield* lefter().children()[i].opacity(1, 1);
    yield* left().children()[i].opacity(1, 1);
    yield* right().children()[i].opacity(1, 1);
  }
  yield* beginAnnonymousSlide();
});
