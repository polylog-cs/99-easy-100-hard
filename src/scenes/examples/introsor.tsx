import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, createRef, sequence, waitFor } from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const comparisonRef = createRef<Layout>();
  const quickIntroSortRef = createRef<PolyTxt>();
  const goodCaseRef = createRef<PolyTxt>();
  const badCaseRef = createRef<PolyTxt>();
  const heapSortRef = createRef<Layout>();

  view.add(
    <Layout layout gap={100} direction={'column'} ref={comparisonRef} opacity={0}>
      <Layout layout gap={40} direction={'row'} justifyContent={'space-between'}>
        <PolyTxt
          text={'Quick sort:'}
          fontSize={80}
          fill={Solarized.text}
          opacity={1}
          width={500}
          ref={quickIntroSortRef}
        />
        <Layout layout gap={40} direction={'column'} justifyContent={'space-between'}>
          <PolyTxt
            text={'99% great'}
            fontSize={80}
            fill={Solarized.text}
            opacity={1}
            ref={goodCaseRef}
          />
          <PolyTxt
            text={'1% bad'}
            fontSize={80}
            fill={Solarized.red}
            opacity={0}
            ref={badCaseRef}
          />
        </Layout>
      </Layout>
      <Layout
        layout
        gap={40}
        direction={'row'}
        justifyContent={'space-between'}
        ref={heapSortRef}
      >
        <PolyTxt
          text={'Heap sort:'}
          fontSize={80}
          fill={Solarized.text}
          opacity={1}
          width={300}
        />
        <PolyTxt text={'100% good'} fontSize={80} fill={Solarized.text} opacity={1} />
      </Layout>
    </Layout>,
  );
  yield* waitFor(1);
  yield* all(comparisonRef().opacity(1, 1));
  yield* badCaseRef().opacity(1, 1);
  yield* waitFor(2);

  yield* all(
    heapSortRef().opacity(0, 1),
    quickIntroSortRef().text('Intro sort:', 1),
    quickIntroSortRef().width(350, 1),
  );
  yield* waitFor(1);
  yield* goodCaseRef().text('99% great (quick sort)', 1);
  yield* waitFor(1);
  yield* all(
    badCaseRef().text('1% good (heap sort)', 1),
    badCaseRef().fill(Solarized.text, 1),
  );
  // yield* introSortRef().opacity(1, 1);
  // yield* introSortRef().opacity(1, 1);
  yield* waitFor(2);
});
