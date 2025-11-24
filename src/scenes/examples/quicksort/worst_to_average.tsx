import { Circle, Layout, Line, makeScene2D, Txt } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  chain,
  createRef,
  easeOutCubic,
  sequence,
  useLogger,
  Vector2,
  waitFor,
} from '@motion-canvas/core';

import { QuickSort } from '../../../components/QuickSort';
import { Solarized } from '../../../utilities/color';
import { PolyTxt } from '../../../utilities/text';
import { createShadow } from '../../../utilities/visuals';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const qs1 = createRef<QuickSort>();

  const commonProps = {
    elementGap: 15,
    width: 600,
    height: 400,
    elementCount: 12,
    animationSpeed: 0.2,
    position: [-450, 0],
  };

  view.add(<QuickSort ref={qs1} {...commonProps} />);
  const qs2 = createRef<QuickSort>();
  view.add(<QuickSort ref={qs2} {...commonProps} />);

  qs1().almostSort();
  qs2().setValues(qs1().getValues());

  yield* beginSlide('quicksort worst to average start');

  yield* all(qs1().initialize(), qs2().initialize());

  const worstCaseLabel = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      ref={worstCaseLabel}
      text=""
      fill={Solarized.red}
      fontSize={70}
      position={[-400, 300]}
    />,
  );
  yield* worstCaseLabel().text('Worst case', 1);

  yield* beginSlide('quicksort worst to average');

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
      position={[0, -80]}
    />,
  );

  yield* all(
    qs2().position(new Vector2(450, 0), 1),
    arrow().end(1, 1),
    shuffleLabel().text('shuffle', 1),
  );

  yield* qs2().shuffleAnimated(0.15);

  const averageCaseLabel = createRef<PolyTxt>();
  view.add(
    <PolyTxt
      ref={averageCaseLabel}
      text=""
      fill={Solarized.green}
      fontSize={70}
      position={[400, 300]}
    />,
  );
  yield* averageCaseLabel().text('Average case', 1);

  yield* beginSlide('quicksort worst to average end');
});
