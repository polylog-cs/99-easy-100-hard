import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, createRef, sequence } from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { beginAnnonymousSlide } from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const title99 = createRef<PolyTxt>();
  const pro99 = createRef<PolyTxt>();
  const con99 = createRef<PolyTxt>();
  const title100 = createRef<PolyTxt>();
  const pro100 = createRef<PolyTxt>();
  const con100 = createRef<PolyTxt>();

  view.add(
    <Layout layout direction={'row'} gap={150}>
      <Layout direction={'column'} alignItems="center" gap={20}>
        <PolyTxt
          ref={title99}
          text="99% certainty"
          fontSize={80}
          fontWeight="bold"
          opacity={0}
        />
        <PolyTxt ref={con99} text="a" fontSize={60} fill={Solarized.red} scale={0} />
        <PolyTxt ref={pro99} text="a" fontSize={60} fill={Solarized.green} scale={0} />
      </Layout>
      <Layout direction={'column'} alignItems="center" gap={20}>
        <PolyTxt
          ref={title100}
          text="100% certainty"
          fontSize={80}
          fontWeight="bold"
          opacity={0}
        />
        <PolyTxt ref={pro100} text="a" fontSize={60} fill={Solarized.green} scale={0} />
        <PolyTxt ref={con100} text="a" fontSize={60} fill={Solarized.red} scale={0} />
      </Layout>
    </Layout>,
  );

  yield* all(title99().opacity(1, 1), title100().opacity(1, 1));
  yield* sequence(
    0.3,
    all(con99().scale(1, 0.5), con99().text('not 100%', 0.7)),
    all(pro100().scale(1, 0.5), pro100().text('fully certain', 0.7)),
  );

  yield* all(con100().scale(1, 0.5), con100().text('hundreds of MBs', 0.7));

  yield* all(pro99().scale(1, 0.5), pro99().text('small data', 0.7));

  yield* beginAnnonymousSlide();
});
