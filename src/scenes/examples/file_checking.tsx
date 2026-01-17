import {
  blur,
  Circle,
  Img,
  Layout,
  makeScene2D,
  Node,
  Rect,
  Video,
} from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  chain,
  Color,
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  linear,
  sequence,
  useRandom,
  Vector2,
  waitFor,
} from '@motion-canvas/core';

import backgroundVideo from '../../assets/background.mp4';
import { BEE_MOVIE_SCRIPT } from '../../assets/bee';
import cdSvg from '../../assets/cd.svg';
import computerSvg from '../../assets/computer.svg';
import keyboardSvg from '../../assets/keyboard.svg';
import { Sha256Hash } from '../../components/Sha256Hash';
import { UploadLine } from '../../components/UploadLine';
import disintegrateShader from '../../shaders/disintegrate.glsl';
import gradientDownShader from '../../shaders/gradientDown.glsl';
import halfScreenNegateShader from '../../shaders/half_negate_screen.glsl';
import halfNegateShader from '../../shaders/half_negate.glsl';
import lighten from '../../shaders/lighten.glsl';
import negative from '../../shaders/negative.glsl';
import { colorLerp, Solarized } from '../../utilities/color';
import { appear } from '../../utilities/creation';
import { beginAnnonymousSlide } from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';
import { createShadow } from '../../utilities/visuals';
import rock_paper_scissors from './rock_paper_scissors';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const disintegrageSignal2 = createSignal(1);

  const file = createRef<Img>();
  const shadow = createRef<Circle>();

  view.add(createShadow(file, { ref: shadow }));
  view.add(
    <Img
      ref={file}
      src={cdSvg}
      width={600}
      opacity={0}
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

  let computerRef = createRef<Img>();
  let keyboardRef = createRef<Img>();

  view.add(<Img ref={computerRef} src={computerSvg} width={800} x={1300} />);
  view.add(<Img ref={keyboardRef} src={keyboardSvg} width={800} x={1300} />);

  // yield* all(file().fontSize(200, 1), file().x(-500, 1));

  view.add(
    createShadow(computerRef, { offsetY: -180, heightRatio: 0.08, widthRatio: 0.9 }),
  );

  view.add(
    createShadow(keyboardRef, { offsetY: -50, heightRatio: 0.14, widthRatio: 0.8 }),
  );

  const videoRef = createRef<Video>();
  const squareRef = createRef<Rect>();
  let signal = createSignal(1);
  view.add(
    <Node cache>
      <Rect
        width={598}
        ref={squareRef}
        fill={1}
        opacity={0}
        height={384}
        lineWidth={10}
        stroke={new Color(0, 0, 0, 0.5)}
        x={() => computerRef().x()}
        y={-144}
      />
      <Video
        play={true}
        ref={videoRef}
        src={backgroundVideo}
        height={600}
        x={() => computerRef().x()}
        y={-144}
        zIndex={10}
        shaders={{ fragment: negative, uniforms: { strength: signal } }}
        opacity={1}
        compositeOperation={'source-in'}
      />
    </Node>,
  );

  yield* all(
    file().y(-140, 1),
    shadow().opacity(0, 1),
    file().scale(0.5, 1),
    file().rotation(360 * 2, 3),
    delay(0.5, all(computerRef().x(0, 1.5), keyboardRef().x(0, 1.5))),
    delay(1.5, all(signal(0, 0), squareRef().opacity(1, 1))),
  );

  const redSquareRef = squareRef().clone();
  redSquareRef.opacity(0);
  redSquareRef.fill(Solarized.red);

  view.add(redSquareRef);

  yield* signal(0.75, 0.01, linear).to(0.75, 0.3).to(0, 0.01, linear);
  yield* waitFor(1);

  const sadRef = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      text={'Borked!'}
      opacity={0}
      fill={Solarized.base3}
      stroke={Solarized.base00}
      lineWidth={7}
      strokeFirst={true}
      ref={sadRef}
      fontSize={140}
      y={-130}
      textAlign={'center'}
      zIndex={10}
    />,
  );

  yield* all(
    videoRef().filters.blur(7, 1),
    redSquareRef.opacity(0.5, 1),
    sadRef().opacity(1, 1),
  );

  yield* waitFor(1);

  // let texts = ['Nope.', '🥱'];

  // for (let text of texts) {
  //   yield* all(
  //     videoRef().filters.blur(0, 1),
  //     redSquareRef.opacity(0.0, 1),
  //     sadRef().opacity(0, 1),

  //     chain(file().x(-300, 1), file().x(0, 1)),
  //     file().rotation(360 * (4 + 2 * texts.indexOf(text)), 3),

  //     delay(
  //       1.5,
  //       all(
  //         signal(0.75, 0.01, linear).to(0.75, 0.05).to(0, 0.01, linear),
  //         sadRef().text(text, 0),
  //         videoRef().filters.blur(7, 1),
  //         redSquareRef.opacity(0.5, 1),
  //         sadRef().opacity(1, 1),
  //       ),
  //     ),
  //   );
  // }

  yield* all(
    sadRef().opacity(0, 1),
    computerRef().opacity(0.0, 1),
    keyboardRef().opacity(0.0, 1),
    redSquareRef.opacity(0.0, 1),
    squareRef().opacity(0.0, 1),

    delay(
      0.5,
      all(
        file().y(0, 1),
        file().scale(1, 1),

        shadow().opacity(0.15, 1),
      ),
    ),
  );

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
    file().width(300, 1),
  );

  // Use our new UploadLine component
  const uploadLine = createRef<UploadLine>();
  view.add(
    <UploadLine
      ref={uploadLine}
      startPoint={file().position().add(new Vector2(50, 0))}
      endPoint={file().position().mul(-1).add(new Vector2(-50, 0))}
      zIndex={-1}
      shaders={halfScreenNegateShader}
    />,
  );

  const uploadedFile = createRef<PolyTxt>();
  const disintegrageSignal = createSignal(1);
  view.add(createShadow(uploadedFile));
  view.add(
    <Img
      ref={uploadedFile}
      src={cdSvg}
      width={300}
      position={file().position().mul(-1)}
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

  yield* all(
    file().position(
      file()
        .position()
        .add(new Vector2(0, -250 + 80)),
      1,
    ),
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
      startPoint={file().position().add(new Vector2(0, 50))}
      endPoint={hashObject().top()}
      zIndex={-1}
    />,
  );

  yield shaLine().upload();
  yield shaLine().start();
  yield* waitFor(0.65);

  yield all(delay(1, shaLine().stop()));
  yield* hashObject().iterate(40, 0.05);

  yield* waitFor(1);

  const originalHash = hashObject().getHashText();

  yield* all(
    delay(0.5, hashObject().iterate(7, 0.05)),
    hashObject().getSha().fill(Solarized.orange, 1, easeInOutCubic, colorLerp),
    disintegrageSignal2(0.5, 1),
  );

  yield* all(
    delay(0.25, hashObject().iterate(7, 0.05, originalHash)),
    hashObject().getSha().fill(Solarized.cyan, 1, easeInOutCubic, colorLerp),
    disintegrageSignal2(1, 1),
  );

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
      startPoint={uploadedFile().position().add(new Vector2(0, 50))}
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
    delay(0.5, hashObject().iterate(7, 0.05, hashObject().getHashText())),
    hashObject().getSha().fill(Solarized.orange, 1, easeInOutCubic, colorLerp),
    disintegrageSignal2(0.5, 1),
    equal().stroke(Solarized.orange, 1, easeInOutCubic, colorLerp),
    appear(notEqual),
    probably().fill(Solarized.orange, 1, easeInOutCubic, colorLerp),
  );

  yield* beginAnnonymousSlide();
});
