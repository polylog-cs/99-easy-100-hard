import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, createRef, sequence } from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { beginAnnonymousSlide } from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const titleMultiply = createRef<PolyTxt>();
  const proMultiply = createRef<PolyTxt>();
  const conMultiply = createRef<PolyTxt>();
  const titleRandom = createRef<PolyTxt>();
  const proRandom = createRef<PolyTxt>();
  const conRandom = createRef<PolyTxt>();

  view.scale(view.scale().x * 1.15);

  view.add(
    <Layout layout direction={'row'} gap={150}>
      <Layout direction={'column'} alignItems="center" gap={20}>
        <PolyTxt
          ref={titleMultiply}
          text="Multiply out"
          fontSize={80}
          fontWeight="bold"
          opacity={0}
        />
        <PolyTxt
          ref={conMultiply}
          text="a"
          fontSize={60}
          fill={Solarized.green}
          scale={0}
        />
        <PolyTxt
          ref={conRandom}
          text="a"
          fontSize={60}
          fill={Solarized.red}
          scale={0}
        />
      </Layout>
      <Layout direction={'column'} alignItems="center" gap={20}>
        <PolyTxt
          ref={titleRandom}
          text="Random testing"
          fontSize={80}
          fontWeight="bold"
          opacity={0}
        />
        <PolyTxt
          ref={proRandom}
          text="a"
          fontSize={60}
          fill={Solarized.red}
          scale={0}
        />
        <PolyTxt
          ref={proMultiply}
          text="a"
          fontSize={60}
          fill={Solarized.green}
          scale={0}
        />
      </Layout>
    </Layout>,
  );

  yield* all(titleMultiply().opacity(1, 1), titleRandom().opacity(1, 1));
  yield* sequence(
    0.0,
    all(conMultiply().scale(1, 0.5), conMultiply().text('100% certain!', 0.7)),
    all(conRandom().scale(1, 0.5), conRandom().text('Slow...', 0.7)),
  );

  yield* sequence(
    0.0,
    all(proRandom().scale(1, 0.5), proRandom().text('99% certain...', 0.7)),
    all(proMultiply().scale(1, 0.5), proMultiply().text('Fast!', 0.7)),
  );

  yield* beginAnnonymousSlide();
});
