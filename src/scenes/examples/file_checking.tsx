import { makeScene2D, Rect } from '@motion-canvas/2d';
import {
  all,
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  useRandom,
  Vector2,
  waitFor,
} from '@motion-canvas/core';

import { BEE_MOVIE_SCRIPT } from '../../assets/bee';
import { Sha256Hash } from '../../components/Sha256Hash';
import { UploadLine } from '../../components/UploadLine';
import disintegrateShader from '../../shaders/disintegrate.glsl';
import gradientDownShader from '../../shaders/gradientDown.glsl';
import { colorLerp, Solarized } from '../../utilities/color';
import { appear } from '../../utilities/creation';
import { PolyTxt } from '../../utilities/text';
import { createShadow } from '../../utilities/visuals';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const file = createRef<PolyTxt>();
  view.add(createShadow(file));
  view.add(<PolyTxt text={'🗂️'} ref={file} fontSize={200} />);

  // Animations
  yield* appear(file);

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
    file().position(file().position().sub(new Vector2(480, 0)), 1),
    square().left(new Vector2(0, 0), 1),
  );

  // Use our new UploadLine component
  const uploadLine = createRef<UploadLine>();
  view.add(
    <UploadLine
      ref={uploadLine}
      startPoint={file().position()}
      endPoint={file().position().mul(-1)}
      zIndex={-1}
    />,
  );

  const uploadedFile = createRef<PolyTxt>();
  const disintegrageSignal = createSignal(1);
  view.add(createShadow(uploadedFile));
  view.add(
    <PolyTxt
      text={'🗂️'}
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

  yield uploadLine().upload();
  yield* all(uploadLine().start(1), delay(0.5, appear(uploadedFile)));

  yield* uploadLine().stop(1);

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
      startPoint={file().position()}
      endPoint={hashObject().top()}
      zIndex={-1}
    />,
  );

  yield shaLine().upload();
  yield shaLine().start();
  yield* waitFor(0.65);

  yield all(delay(1, shaLine().stop()));
  yield* hashObject().iterate(38, 0.05);

  yield* waitFor(1);

  yield* all(
    uploadedFile().position(
      new Vector2(uploadedFile().position().x, file().position().y),
      1,
    ),
  );

  const secondHashObject = createRef<Sha256Hash>();
  const negativeSignal = createSignal(0);
  view.add(
    <Sha256Hash
      ref={secondHashObject}
      position={uploadedFile().position()}
      hashProps={{ fill: Solarized.base2 }}
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
      startPoint={uploadedFile().position()}
      endPoint={secondHashObject().top()}
      zIndex={-1}
    />,
  );

  yield secondShaLine().upload();
  yield secondShaLine().start();
  yield* waitFor(0.65);

  yield all(delay(1, secondShaLine().stop()));
  yield* secondHashObject().iterate(38, 0.05, hashObject().getHashText());

  yield* waitFor(1);

  let equal = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      position={new Vector2(0, 270)}
      text={'='}
      stroke={Solarized.cyan}
      lineWidth={10}
      fontSize={200}
      ref={equal}
      textAlign={'center'}
    />,
  );

  yield* appear(equal);

  yield* waitFor(1);

  yield* all(
    equal().stroke(Solarized.orange, 1, easeInOutCubic, colorLerp),
    secondHashObject().getSha().fill(Solarized.orange, 1, easeInOutCubic, colorLerp),
    disintegrageSignal(0.5, 1),
    delay(0.5, secondHashObject().iterate(5, 0.05)),
  );

  let notEqual = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      position={new Vector2(0, 270)}
      text={'/'}
      stroke={Solarized.orange}
      lineWidth={10}
      fontSize={120}
      ref={notEqual}
      textAlign={'center'}
    />,
  );

  yield* all(appear(notEqual));

  yield* waitFor(1);
});
