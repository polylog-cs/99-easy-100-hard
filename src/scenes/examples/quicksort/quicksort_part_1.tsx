import { makeScene2D } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  fadeTransition,
  waitFor,
} from '@motion-canvas/core';

import { QuickSort } from '../../../components/QuickSort';
import { Solarized } from '../../../utilities/color';
import { beginAnnonymousSlide } from '../../../utilities/presentation';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);
  view.fill(Solarized.background);

  const qs = createRef<QuickSort>();

  view.add(
    <QuickSort
      ref={qs}
      elementGap={20}
      width={1500}
      height={800}
      elementCount={12}
      animationSpeed={0.2}
    />,
  );

  yield waitFor(0.5);

  qs().shuffle();

  yield* qs().initialize();

  yield* beginAnnonymousSlide();
  yield* qs().setQuicksortColors(
    0,
    qs().elementCount - 1,
    0,
    null,
    -1,
    qs().animationSpeed * 0.5,
  );
  qs().sortedIndices.clear();
  qs().comparisonCount = 0;
  qs().pivotStrategy = 'first';

  const pivotIdx = yield* qs().partition(0, qs().elementCount - 1);
  qs().animationSpeed = 0.06;

  yield* beginAnnonymousSlide();

  yield* qs().quicksort(0, pivotIdx - 1);
  yield* qs().setQuicksortColors(
    0,
    qs().elementCount - 1,
    pivotIdx,
    pivotIdx,
    pivotIdx,
    0.25,
  );

  yield* beginAnnonymousSlide();

  yield* qs().quicksort(pivotIdx + 1, qs().elementCount - 1);
  yield* qs().setQuicksortColors(
    0,
    qs().elementCount - 1,
    pivotIdx,
    pivotIdx,
    pivotIdx,
    0.25,
  );

  yield* beginAnnonymousSlide();
});
