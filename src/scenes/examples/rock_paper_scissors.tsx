import { Img, Layout, Line, makeScene2D, Rect, Txt } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  createSignal,
  delay,
  easeOutQuad,
  linear,
  waitFor,
} from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { PolyTxt } from '../../utilities/text';

const nbsp = ' ';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);
  yield* beginSlide('rock paper scissors');

  const player1text = createRef<PolyTxt>();
  const player1icon = createRef<Txt>();
  const player2text = createRef<PolyTxt>();
  const player2icon = createRef<Txt>();

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
      <PolyTxt fontSize={fontSize} fill={Solarized.blue} ref={player1text}>
        {nbsp}
      </PolyTxt>
      <Txt fontSize={emojiSize} ref={player1icon}>
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
      <PolyTxt fontSize={fontSize} fill={Solarized.blue} ref={player2text}>
        {nbsp}
      </PolyTxt>
      <Txt fontSize={emojiSize} ref={player2icon}>
        👀
      </Txt>
    </Rect>,
  );

  yield* waitFor(1);
  yield* player1text().text("(I'll play rock)", 1);

  const arrow = createRef<Line>();

  view.add(
    <Line
      points={[
        [shift - 130, 0],
        [-shift + 300, -100],
      ]}
      stroke={Solarized.gray}
      fill={Solarized.gray}
      lineWidth={10}
      start={0}
      end={0}
      endArrow
      ref={arrow}
    />,
  );

  yield* player1text().text("(I'll play rock)", 1);

  yield* beginSlide('telepathy');
  yield* arrow().end(1, 1);
  yield* player2text().text("(Ok, I'll play paper)", 1);

  yield* beginSlide('reveal moves');
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
    player1text().text(nbsp, 0.5),
    player2text().text(nbsp, 0.5),
  );

  player1text().fill(Solarized.gray);
  player2text().fill(Solarized.gray);

  yield* all(
    countdown(0, 2, linear),
    delay(1, all(player1text().text('Rock!', 1), player2text().text('Paper!', 1))),
  );
  yield* player1icon().text('😭', 1);
  yield* beginSlide('randomness to the rescue');

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
      <Txt fontSize={emojiSize} ref={dieIcon} opacity={0}>
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
  player1text().fill(Solarized.blue);
  player2text().fill(Solarized.blue);

  yield* beginSlide('randomness to the rescue 2');

  yield* player1text().text("(I'll play randomly)", 1);

  yield* beginSlide('randomness to the rescue 3');
  arrow().end(0);
  arrow().opacity(1);

  yield* arrow().end(0.8, 1);
  yield* player2text().text('(What now?)', 1);

  yield* beginSlide('randomness to the rescue 4');
  dieText().opacity(0);

  const dieRoll = createSignal(0);
  dieText().text(() => ['Rock', 'Paper', 'Scissors'][Math.round(dieRoll()) % 3]);
  yield* all(
    arrow().opacity(0, 0.5),
    player1text().text(nbsp, 0.5),
    player2text().text(nbsp, 0.5),
    dieText().opacity(1, 0.5),
    dieRoll(31, 3.5, easeOutQuad),
  );

  yield* all(
    countdown(0, 2, linear),
    delay(
      1,
      all(
        player1text().text('Paper!', 1),
        player1text().fill(Solarized.gray, 1),
        player2text().text('Rock!', 1),
        player2text().fill(Solarized.gray, 1),
      ),
    ),
  );
  yield* all(player1icon().text('🥳', 1), player2icon().text('😭', 1));
  countdown(4);

  yield* waitFor(3);
});
