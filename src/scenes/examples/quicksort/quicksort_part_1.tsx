import { makeScene2D } from '@motion-canvas/2d';
import { all, beginSlide, createRef } from '@motion-canvas/core';

import { QuickSort } from '../../../components/QuickSort';
import { Solarized } from '../../../utilities/color';

export default makeScene2D(function* (view) {
  yield* beginSlide('quicksort part 1');
  view.fill(Solarized.background);

  const qs = createRef<QuickSort>();

  view.add(
    <QuickSort
      ref={qs}
      elementGap={20}
      width={1500}
      height={800}
      elementCount={12}
      animationSpeed={0.25}
    />,
  );

  // qs().shuffle();
  qs().shuffle();

  yield* qs().initialize();

  yield* beginSlide('quicksort part 1 go');
  yield* qs().sort('first');

  yield* beginSlide('quicksort part 1 end');
});
