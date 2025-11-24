import { Img, Layout, makeScene2D } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  Direction,
  fadeTransition,
  finishScene,
  slideTransition,
  waitFor,
} from '@motion-canvas/core';

import qrPng from '../../assets/qr.png';
import shader from '../../shaders/shader.glsl';
import { Solarized } from '../../utilities/color';
import { beginAnnonymousSlide } from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const title = createRef<PolyTxt>();
  const presentLayout = createRef<Layout>();
  const notHereLayout = createRef<Layout>();
  const pastLayout = createRef<Layout>();
  const urlLayout = createRef<Layout>();
  const qrCode = createRef<Img>();

  const x = -300;
  const y = 150;

  const titleFontSize = 120;
  const labelFontSize = 30;
  const nameFontSize = 40;

  view.add(
    <>
      <PolyTxt ref={title} text={''} fontSize={titleFontSize} position={[0, -300]} />

      <Layout
        ref={presentLayout}
        layout
        direction={'column'}
        gap={10}
        alignItems={'center'}
        position={[x, -180 + y]}
        opacity={0}
      >
        <PolyTxt
          text={'Present Polylog members'}
          fill={Solarized.base1}
          fontSize={labelFontSize}
        />
        <PolyTxt
          text={'Richard Hladík, Tom Sláma, Václav Volhejn'}
          fontSize={nameFontSize}
        />
      </Layout>

      <Layout
        ref={notHereLayout}
        layout
        direction={'column'}
        gap={10}
        alignItems={'center'}
        position={[x, -50 + y]}
        opacity={0}
      >
        <PolyTxt text={'Not here'} fill={Solarized.base1} fontSize={labelFontSize} />
        <PolyTxt text={'Vašek Rozhoň'} fontSize={nameFontSize} />
      </Layout>

      <Layout
        ref={pastLayout}
        layout
        direction={'column'}
        gap={10}
        alignItems={'center'}
        position={[x, 80 + y]}
        opacity={0}
      >
        <PolyTxt
          text={'Past collaborators'}
          fill={Solarized.base1}
          fontSize={labelFontSize}
        />
        <PolyTxt
          text={'Filip Hlásek, Vojtěch Rozhoň, Gabor Hollbeck'}
          fontSize={nameFontSize}
        />
      </Layout>

      <Layout
        ref={urlLayout}
        layout
        direction={'column'}
        gap={15}
        alignItems={'center'}
        position={[500, 130]}
        opacity={0}
      >
        <Img
          ref={qrCode}
          scale={1.2}
          src={qrPng}
          width={460}
          height={460}
          shaders={{
            fragment: shader,
            uniforms: { intensity: 0.85 },
          }}
        />
        <PolyTxt
          text={'Presentation Source Code'}
          fontSize={38}
          fill={Solarized.base1}
        />
      </Layout>
    </>,
  );

  yield* beginAnnonymousSlide();

  // Animate title appearance
  yield* title().text('Thank you!', 1);

  yield* all(
    presentLayout().opacity(1, 0.8),

    notHereLayout().opacity(1, 0.8),

    pastLayout().opacity(1, 0.8),

    urlLayout().opacity(1, 0.8),
  );

  yield* beginAnnonymousSlide();
});
