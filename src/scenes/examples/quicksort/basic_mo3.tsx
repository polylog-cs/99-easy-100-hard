import { makeScene2D } from '@motion-canvas/2d';
import { all, createRef } from '@motion-canvas/core';

import { QuickSort } from '../../../components/QuickSort';
import { Solarized } from '../../../utilities/color';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const qs = createRef<QuickSort>();

  view.add(<QuickSort ref={qs} elementGap={20} width={1500} height={800} />);

  qs().shuffle();
  qs().shuffle();

  yield* qs().initialize();
  yield* qs().sort();

  qs().pyramid();

  yield* all(qs().reset(), qs().initialize(0));

  yield* qs().sort('mo3');
});
