import { Img, Layout, Line, makeScene2D, Rect, Txt } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  Color,
  createRef,
  createSignal,
  delay,
  easeInCubic,
  easeOutCubic,
  easeOutQuad,
  fadeTransition,
  linear,
  linear,
  loop,
  Vector2,
  waitFor,
} from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { beginAnnonymousSlide } from '../../utilities/presentation';
import { PolyTxt } from '../../utilities/text';

const nbsp = ' ';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);

  view.fill(Solarized.background);

  const player1text = createRef<PolyTxt>();
  const player1icon = createRef<Txt>();
  const player2text = createRef<PolyTxt>();
  const player2icon = createRef<Txt>();
  const brainIcon = createRef<Txt>();

  const shift = 400;
  const fontSize = 90;
  const emojiSize = 200;

  view.add(
    <Rect
      layout
      direction={'column'}
      alignItems={'center'}
      position={[-shift, 0]}
      gap={30}
    >
      <PolyTxt
        fontSize={fontSize}
        fill={Solarized.gray}
        ref={player1text}
        fontStyle={'italic'}
      >
        {nbsp}
      </PolyTxt>
      <Txt
        fontSize={emojiSize}
        fontFamily={'Noto Color Emoji'}
        ref={player1icon}
        opacity={0}
        scale={0}
      >
        🙂
      </Txt>
    </Rect>,
  );
  view.add(
    <Rect
      layout
      direction={'column'}
      alignItems={'center'}
      position={[shift, 0]}
      gap={30}
    >
      <PolyTxt
        fontSize={fontSize}
        fill={Solarized.gray}
        fontStyle={'italic'}
        ref={player2text}
      >
        {nbsp}
      </PolyTxt>
      <Txt
        fontSize={emojiSize}
        fontFamily={'Noto Color Emoji'}
        ref={player2icon}
        opacity={0}
        scale={0}
      >
        👀
      </Txt>
    </Rect>,
  );

  view.add(
    <Txt
      fontSize={emojiSize * 0.6}
      fontFamily={'Noto Color Emoji'}
      ref={brainIcon}
      absolutePosition={() => player2icon().absolutePosition()}
      opacity={0}
      zIndex={-1}
      scale={0}
    >
      🧠
    </Txt>,
  );

  const arrow = createRef<Line>();
  const colorSignal = createSignal(0);
  const directionSignal = createSignal(0);

  view.add(
    <Line
      points={[
        [shift - 130, 0],
        [-shift + 300, -100],
      ]}
      stroke={() => new Color('#ea6363').lerp('#ffb3b3', colorSignal())}
      lineWidth={10}
      start={0}
      end={0}
      endArrow
      ref={arrow}
      lineDash={[20, 10]}
      lineDashOffset={() => directionSignal() * 30}
    />,
  );

  yield* waitFor(0.5);

  yield loop(() =>
    all(
      brainIcon()
        .offset(new Vector2(0, 1.0), 0.5, easeOutCubic)
        .to(new Vector2(0, 1.1), 0.5, easeInCubic),
      brainIcon()
        .scale(new Vector2(1.0, 1.0), 0.5, easeOutCubic)
        .to(new Vector2(1.25, 1.25), 0.5, easeInCubic),
      colorSignal(1, 0.5, easeOutCubic).to(0, 0.5, easeInCubic),
    ),
  );

  yield loop(() => directionSignal(1, 0.1, linear).to(0, 0.0, linear));

  yield* all(
    player2icon().opacity(1, 1),
    player2icon().scale(1, 1),
    player1icon().opacity(1, 1),
    player1icon().scale(1, 1),
  );

  yield* all(player1text().text("(I'll play rock)", 1));

  yield* player1text().text("(I'll play rock)", 1);

  yield* beginAnnonymousSlide();
  yield* all(arrow().end(1, 1), brainIcon().opacity(1, 1));
  yield* waitFor(1.5);
  yield* player2text().text("(Ok, I'll play paper)", 1);

  yield* waitFor(3.5);

  yield* beginAnnonymousSlide();
  const countdown = createSignal(4);
  view.add(
    <PolyTxt
      fontSize={fontSize * 2}
      position={[0, -300]}
      fill={Solarized.gray}
      text={() => ['Go!', '1', '2', '3', ''][Math.floor(countdown())]}
      opacity={() => (countdown() >= 3 ? Math.min(1, 4 - countdown()) : 1)}
    />,
  );

  yield* all(
    arrow().opacity(0, 0.5),
    arrow().end(0, 0.5),
    brainIcon().opacity(0, 0.5),
    player1text().text(nbsp, 0.5),
    player2text().text(nbsp, 0.5),
  );

  player1text().fontStyle('normal');
  player2text().fontStyle('normal');

  yield* all(
    countdown(0, 2, linear),
    delay(1.2, all(player1text().text('Rock!', 1), player2text().text('Paper!', 1))),
  );
  yield* player1icon().text('😭', 1);
  yield* beginAnnonymousSlide();

  const dieText = createRef<PolyTxt>();
  const dieIcon = createRef<Txt>();

  view.add(
    <Rect
      layout
      direction={'column'}
      alignItems={'center'}
      position={[-shift - 280, 200]}
    >
      <PolyTxt fontSize={fontSize} fill={Solarized.red} ref={dieText}>
        {nbsp}
      </PolyTxt>
      <Txt
        fontSize={emojiSize}
        fontFamily={'Noto Color Emoji'}
        ref={dieIcon}
        opacity={0}
      >
        🎲
      </Txt>
    </Rect>,
  );

  countdown(4);

  yield* all(
    player1icon().text('😏', 0.5),
    dieIcon().opacity(1, 1),
    player1text().text(nbsp, 1),
    player2text().text(nbsp, 1),
  );
  player1text().fontStyle('italic');
  player2text().fontStyle('italic');

  yield* beginAnnonymousSlide();

  yield* player1text().text("(I'll play randomly)", 1);

  yield* beginAnnonymousSlide();
  arrow().end(0);
  arrow().opacity(1);

  yield* all(arrow().end(0.8, 1), brainIcon().opacity(1, 1));

  yield* waitFor(3.5);

  yield* all(
    player2text().text('(What now?)', 1),
    brainIcon().opacity(0, 0.5),
    brainIcon().scale(0, 0.5),
    arrow().end(0.0, 0.5),
    arrow().opacity(0, 0.5),
  );

  yield* beginAnnonymousSlide();
  dieText().opacity(0);

  const dieRoll = createSignal(0);
  dieText().text(() => ['Rock', 'Paper', 'Scissors'][Math.round(dieRoll()) % 3]);
  yield* all(
    player1text().text(nbsp, 0.5),
    player2text().text(nbsp, 0.5),
    dieText().opacity(1, 0.5),
    dieRoll(31, 3.5, easeOutQuad),
  );
  player1text().fontStyle('normal');
  player2text().fontStyle('normal');

  yield* all(
    countdown(0, 2, linear),
    delay(1.2, all(player1text().text('Paper!', 1), player2text().text('Rock!', 1))),
  );
  yield* all(player1icon().text('🥳', 1), player2icon().text('😭', 1));
  countdown(4);

  yield* waitFor(3);
  yield* beginAnnonymousSlide();
});
