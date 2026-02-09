import { Circle, Layout, Line, makeScene2D, Txt } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  chain,
  Color,
  createRef,
  createSignal,
  delay,
  easeOutCubic,
  sequence,
  useLogger,
  Vector2,
  waitFor,
} from '@motion-canvas/core';

import { QuickSort } from '../../../components/QuickSort';
import { Solarized } from '../../../utilities/color';
import { beginAnnonymousSlide } from '../../../utilities/presentation';
import { PolyTxt } from '../../../utilities/text';
import { createShadow } from '../../../utilities/visuals';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  view.scale(view.scale().x * 1.095);
  view.position(view.position().add(new Vector2(0, -90)));

  const qs1 = createRef<QuickSort>();

  const width = createSignal(600);
  const height = createSignal(400);
  const elementGap = createSignal(15);

  const commonProps = {
    elementGap: elementGap,
    width: width,
    height: height,
    elementCount: 12,
    animationSpeed: 0.2,
    position: [-410, 0],
    colors: {
      default: Solarized.red,
    },
  };

  view.add(<QuickSort ref={qs1} {...commonProps} />);

  yield* waitFor(0.5);

  const qs2 = createRef<QuickSort>();
  view.add(<QuickSort ref={qs2} {...commonProps} />);

  qs1().almostSort();
  qs2().setValues(qs1().getValues());

  yield* beginAnnonymousSlide();

  yield* all(qs1().initialize(), qs2().initialize());

  const worstCaseLabel = createRef<PolyTxt>();
  view.add(
    <PolyTxt ref={worstCaseLabel} text="" fontSize={70} position={[-410, 300]} />,
  );

  const weOkayLabel = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      ref={weOkayLabel}
      text=""
      fontSize={45}
      position={() => worstCaseLabel().position().addY(80)}
    />,
  );

  yield* all(worstCaseLabel().text('Worst Case', 1));

  yield* beginAnnonymousSlide();

  // Move qs2 to the right

  // Create an arrow between the two QuickSort components
  const arrow = createRef<Line>();
  view.add(
    <Line
      ref={arrow}
      points={[
        new Vector2(-70, 0), // end of qs1
        new Vector2(70, 0), // start of qs2
      ]}
      stroke={Solarized.base01}
      lineWidth={15}
      endArrow
      position={[0, 0]}
      end={0}
    />,
  );

  const shuffleLabel = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      ref={shuffleLabel}
      text=""
      fill={Solarized.base00}
      fontSize={60}
      left={() => [-80, -80]}
    />,
  );

  shuffleLabel().opacity(0);
  arrow().opacity(0);
  qs1().opacity(0.25);

  yield* all(
    delay(1, qs1().opacity(1, 1)),
    qs2().opacity(1, 1),
    qs2().position(new Vector2(400, 0), 2),
    delay(0.25, all(arrow().end(1, 1), shuffleLabel().text('shuffle', 1))),
    delay(
      0.5,
      // Use badShuffleAnimated - the shuffle ends up back in almost sorted order (unlucky!)
      // Keep the color red since it's still worst case
      qs2().badShuffleAnimated(0.1),
    ),
  );

  const stillWorstCaseLabel = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      ref={stillWorstCaseLabel}
      text=""
      fill={Solarized.green}
      fontSize={70}
      position={[410, 300]}
    />,
  );

  const lowProbabilityLabel = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      ref={lowProbabilityLabel}
      text=""
      fontSize={45}
      position={() => stillWorstCaseLabel().position().addY(80)}
    />,
  );

  yield* all(
    stillWorstCaseLabel().text('Worst Case Luck!', 1),
    lowProbabilityLabel().text("(we're okay with this)", 1),
  );

  yield* beginAnnonymousSlide();
});
