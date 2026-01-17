import { Img, Layout, makeScene2D, Rect } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  sequence,
  useRandom,
  Vector2,
  waitFor,
} from '@motion-canvas/core';

import { BEE_MOVIE_SCRIPT } from '../../assets/bee';
import cdComparisonPng from '../../assets/cd-comparison.png';
import { Sha256Hash } from '../../components/Sha256Hash';
import { UploadLine } from '../../components/UploadLine';
import disintegrateShader from '../../shaders/disintegrate.glsl';
import gradientDownShader from '../../shaders/gradientDown.glsl';
import halfNegateShader from '../../shaders/half_negate.glsl';
import lighten from '../../shaders/lighten.glsl';
import { colorLerp, Solarized } from '../../utilities/color';
import { appear } from '../../utilities/creation';
import { beginAnnonymousSlide } from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';
import { createShadow } from '../../utilities/visuals';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const disintegrageSignal2 = createSignal(1);

  const file = createRef<PolyTxt>();
  view.add(createShadow(file));
  view.add(
    <PolyTxt
      text={'💿'}
      ref={file}
      fontSize={600}
      opacity={0}
      scale={0}
      offset={new Vector2(0, -0.1)}
      shaders={{
        fragment: disintegrateShader,
        uniforms: { strength: disintegrageSignal2 },
      }}
    />,
  );

  yield* waitFor(0.5);

  // Animations
  yield* appear(file);
  yield* beginAnnonymousSlide();

  yield* all(file().rotation(360 * 2, 2));
  yield* beginAnnonymousSlide();

  yield* all(file().rotation(360 * 4, 3));
  yield* beginAnnonymousSlide();

  yield* all(disintegrageSignal2(0.5, 1));

  yield* beginAnnonymousSlide();

  const square = createRef<Rect>();
  view.add(
    <Rect
      height={view.height()}
      width={view.width()}
      ref={square}
      fill={Solarized.base00}
      position={new Vector2(view.width(), 0)}
      zIndex={-10}
    />,
  );

  yield* all(
    disintegrageSignal2(1, 1),
    file().position(file().position().sub(new Vector2(480, 0)), 1),
    square().left(new Vector2(0, 0), 1),
    file().fontSize(200, 1),
  );

  // Use our new UploadLine component
  const uploadLine = createRef<UploadLine>();
  view.add(
    <UploadLine
      ref={uploadLine}
      startPoint={file().position().add(new Vector2(30, -10))}
      endPoint={file().position().mul(-1).add(new Vector2(-30, -10))}
      zIndex={-1}
    />,
  );

  const uploadedFile = createRef<PolyTxt>();
  const disintegrageSignal = createSignal(1);
  view.add(createShadow(uploadedFile));
  view.add(
    <PolyTxt
      text={'💿'}
      ref={uploadedFile}
      fontSize={200}
      position={file().position().mul(-1)}
      zIndex={10}
      opacity={0}
      shaders={{
        fragment: disintegrateShader,
        uniforms: { strength: disintegrageSignal },
      }}
    />,
  );

  const friend = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      text={'👦🏻'}
      ref={friend}
      fontSize={200}
      position={uploadedFile().position()}
      zIndex={10}
      opacity={0}
    />,
  );

  yield* appear(friend);

  yield* beginAnnonymousSlide();
  yield uploadLine().upload();
  yield* sequence(
    0.3,
    friend().position(friend().position().addY(-300), 1),
    appear(uploadedFile),
  );
  yield* beginAnnonymousSlide();
  yield* uploadLine().start(3);

  yield* beginAnnonymousSlide();
  yield* uploadLine().stop(1);
  yield* beginAnnonymousSlide();

  let code = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      fontStyle={'italic'}
      text={''}
      fill={Solarized.base03}
      scale={0.35}
      ref={code}
      topLeft={() => file().position().add(new Vector2(-350, 200))}
      shaders={gradientDownShader}
    />,
  );

  yield* all(
    code().text(BEE_MOVIE_SCRIPT, 4),
    file().position(file().position().add(new Vector2(0, -250)), 1),
  );

  let tooMuchData = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      text={'Too much data\nto fully check!'}
      position={new Vector2(-480, 150)}
      fontSize={70}
      ref={tooMuchData}
      textAlign={'center'}
    />,
  );

  yield* all(
    tooMuchData().opacity(0).opacity(1, 0.75),
    code().opacity(0.25, 1),
    code().filters.blur(3, 1),
  );

  yield* beginAnnonymousSlide();

  yield* waitFor(1);

  yield* all(
    tooMuchData().opacity(0, 0.5),
    tooMuchData().position(tooMuchData().position().add(new Vector2(0, 150)), 1),
    code().text('', 0.5),
    file().position(file().position().add(new Vector2(0, 80)), 1),
  );

  const hashObject = createRef<Sha256Hash>();
  view.add(<Sha256Hash ref={hashObject} position={file().position()} zIndex={-1} />);

  yield* all(
    appear(hashObject),
    hashObject().position(hashObject().position().add(new Vector2(0, 400)), 1),
  );

  const shaLine = createRef<UploadLine>();
  view.add(
    <UploadLine
      ref={shaLine}
      startPoint={file().position().add(new Vector2(0, 30))}
      endPoint={hashObject().top()}
      zIndex={-1}
    />,
  );

  yield shaLine().upload();
  yield shaLine().start();
  yield* waitFor(0.65);

  yield all(delay(6.5, shaLine().stop()));
  yield* hashObject().iterate(150, 0.05);

  yield* waitFor(1);
  yield* beginAnnonymousSlide();

  yield* all(
    uploadedFile().position(
      new Vector2(uploadedFile().position().x, file().position().y),
      1,
    ),
    friend().opacity(0, 1),
    friend().position(friend().position().addY(-200), 1),
  );

  const secondHashObject = createRef<Sha256Hash>();
  const negativeSignal = createSignal(0);
  view.add(
    <Sha256Hash
      ref={secondHashObject}
      position={uploadedFile().position()}
      hashProps={{ fill: Solarized.base2 }}
      shaders={lighten}
    />,
  );

  yield* all(
    appear(secondHashObject),
    secondHashObject().position(
      secondHashObject().position().add(new Vector2(0, 400)),
      1,
    ),
  );

  const secondShaLine = createRef<UploadLine>();
  view.add(
    <UploadLine
      ref={secondShaLine}
      startPoint={uploadedFile().position().add(new Vector2(0, 30))}
      endPoint={secondHashObject().top()}
      zIndex={-1}
      shaders={lighten}
    />,
  );

  yield secondShaLine().upload();
  yield secondShaLine().start();
  yield* waitFor(0.65);

  yield all(delay(1, secondShaLine().stop()));
  yield* secondHashObject().iterate(38, 0.05, hashObject().getHashText());

  let equal = createRef<PolyTxt>();
  let probably = createRef<PolyTxt>();
  view.add(
    <Layout layout direction={'column'} gap={-100}>
      <PolyTxt
        text={''}
        fill={Solarized.cyan}
        fontSize={100}
        ref={probably}
        textAlign={'center'}
        shaders={halfNegateShader}
      />
      <PolyTxt
        text={'='}
        stroke={Solarized.cyan}
        lineWidth={10}
        fontSize={200}
        ref={equal}
        textAlign={'center'}
        opacity={0}
        shaders={halfNegateShader}
      />
      ,
    </Layout>,
  );

  yield* beginAnnonymousSlide();
  yield* all(appear(equal), probably().text('probably', 1));

  yield* waitFor(1);
  yield* beginAnnonymousSlide();

  let notEqual = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      text={'/'}
      y={65}
      stroke={Solarized.orange}
      lineWidth={10}
      fontSize={120}
      ref={notEqual}
      textAlign={'center'}
      shaders={halfNegateShader}
    />,
  );

  yield* all(
    equal().stroke(Solarized.orange, 1, easeInOutCubic, colorLerp),
    hashObject().getSha().fill(Solarized.orange, 1, easeInOutCubic, colorLerp),
    disintegrageSignal2(0.5, 1),
    delay(0.5, hashObject().iterate(5, 0.05)),
    appear(notEqual),
    probably().text('definitely', 1),
    probably().fill(Solarized.orange, 1, easeInOutCubic, colorLerp),
  );

  yield* beginAnnonymousSlide();

  yield* all(
    equal().stroke(Solarized.cyan, 1, easeInOutCubic, colorLerp),
    hashObject().getSha().fill(Solarized.cyan, 1, easeInOutCubic, colorLerp),
    disintegrageSignal2(1, 1),
    delay(0.5, hashObject().iterate(5, 0.05, secondHashObject().getHashText())),
    notEqual().opacity(0, 1),
    notEqual().scale(0, 1),
    probably().text('probably', 1),
    probably().fill(Solarized.cyan, 1, easeInOutCubic, colorLerp),
  );

  yield* beginAnnonymousSlide();

  // const cdEquationsComparison = createRef<Img>();
  // view.add(
  //   <Img
  //     ref={cdEquationsComparison}
  //     src={cdEquationsComparisonPng}
  //     scale={1}
  //     opacity={0}
  //   />,
  // );
  // yield* all(
  //   cdEquationsComparison().opacity(1, 1),
  //   uploadedFile().opacity(0, 1),
  //   square().opacity(0, 1),
  // );

  // yield* beginSlide('file end');
});
