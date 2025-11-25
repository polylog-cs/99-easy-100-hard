import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, createRef, fadeTransition, sequence } from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { beginAnnonymousSlide } from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);
  view.fill(Solarized.background);

  const text = createRef<PolyTxt>();
  const texta = createRef<PolyTxt>();
  const text2 = createRef<PolyTxt>();
  const text2a = createRef<PolyTxt>();
  view.add(
    <Layout layout direction={'row'} gap={150}>
      <Layout direction={'column'} alignItems="center">
        <PolyTxt ref={text} text="" fontSize={100} fontWeight="bold" />
        <PolyTxt ref={texta} text="c" fontSize={70} opacity={0} />
      </Layout>
      <Layout direction={'column'} alignItems="center">
        <PolyTxt ref={text2} text="" fontSize={100} fontWeight="bold" />
        <PolyTxt ref={text2a} text="" fontSize={70} />
      </Layout>
    </Layout>,
  );

  yield* sequence(1, text().text('99% is fast', 1), text2().text('100% is slow', 1));
  yield* sequence(
    0.5,
    all(texta().opacity(1, 0.3), texta().text('checksums', 1)),
    text2a().text('full disc copy', 1),
  );
  yield* beginAnnonymousSlide();
});
