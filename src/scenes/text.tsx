import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, createRef, easeInOutCubic, waitFor } from '@motion-canvas/core';

import { Solarized } from '../utilities/color';
import { PolyLatex } from '../utilities/latex';
import { PolyTxt, smartTextLerp } from '../utilities/text';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const text = createRef<PolyTxt>();
  const latex = createRef<PolyLatex>();

  view.add(
    <Layout layout gap={120} direction={'row'} alignItems={'center'}>
      <PolyTxt text={''} ref={text} />
      <PolyLatex tex={'\\sum_{i = 1}^{n} n^2'} ref={latex} />
    </Layout>,
  );

  yield* all(
    text().text('Some nice text over here!', 1, easeInOutCubic, smartTextLerp),
    latex().write(1),
  );

  yield* latex().tex('\\sum_{k - x}^{\\infty} n^3 + 1', 1);
  yield* latex().tex('\\sum_{k = -1}^{\\infty - 2} n', 1);
});
