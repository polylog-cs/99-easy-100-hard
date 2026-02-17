import { Layout, makeScene2D, Rect } from '@motion-canvas/2d';
import {
  all,
  createRef,
  delay,
  sequence,
  SoundBuilder,
  useRandom,
  waitFor,
} from '@motion-canvas/core';

import { HeapSort } from '../../components/HeapSort';
import { QuickSort } from '../../components/QuickSort';
import { Solarized } from '../../utilities/color';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  view.add(<Rect width={10000} height={10000} fill={Solarized.background} />);

  const comparisonRef = createRef<Layout>();
  const heapSortLabelRef = createRef<PolyTxt>();
  const quickIntroSortRef = createRef<PolyTxt>();
  const introIntroSortRef = createRef<PolyTxt>();
  const heapGoodRef = createRef<PolyTxt>();
  const goodCaseRef = createRef<PolyTxt>();
  const badCaseRef = createRef<PolyTxt>();
  const hs = createRef<HeapSort>();
  const qs = createRef<QuickSort>();
  const heapDetailRef = createRef<PolyTxt>();

  let x = -400;

  view.add(
    <Layout layout={false} ref={comparisonRef} opacity={1}>
      {/* Sort names (bold) */}
      <PolyTxt
        text={'Heap sort'}
        fontSize={80}
        fontWeight={700}
        fill={Solarized.text}
        x={-x}
        y={-280 + 30}
        ref={heapSortLabelRef}
        opacity={0}
      />
      <PolyTxt
        text={'Quick sort'}
        fontSize={80}
        fontWeight={700}
        fill={Solarized.text}
        x={x}
        y={-280 + 30}
        ref={quickIntroSortRef}
        opacity={0}
      />
      <PolyTxt
        text={'Intro sort'}
        fontSize={90}
        fontWeight={700}
        fill={Solarized.text}
        x={0}
        y={-280 - 100}
        ref={introIntroSortRef}
        opacity={0}
      />

      {/* Percentage texts (one row, slightly smaller) */}
      <PolyTxt
        text={'100% good'}
        fontSize={60}
        fill={Solarized.text}
        x={-x}
        y={-140 - 20}
        ref={heapGoodRef}
        opacity={0}
      />
      <PolyTxt
        text={'99% great'}
        fontSize={60}
        fill={Solarized.text}
        x={x - 130}
        y={-140 - 20}
        ref={goodCaseRef}
        opacity={0}
      />
      <PolyTxt
        text={'1% bad'}
        fontSize={60}
        fill={Solarized.red}
        x={x + 180}
        y={-140 - 20}
        opacity={0}
        ref={badCaseRef}
      />

      {/* Sort visualizations */}
      <HeapSort
        ref={hs}
        width={650}
        height={400}
        elementCount={12}
        elementGap={15}
        animationSpeed={0.15}
        x={-x}
        y={140}
        opacity={1}
      />
      <QuickSort
        ref={qs}
        width={650}
        height={400}
        elementCount={12}
        elementGap={15}
        animationSpeed={0.15}
        x={x}
        y={140}
        opacity={1}
      />

      {/* Detail line */}
      <PolyTxt
        ref={heapDetailRef}
        text={'heap sort when recursion too deep'}
        fontSize={60}
        fill={Solarized.text}
        y={350}
        opacity={0}
      />
    </Layout>,
  );

  // Shuffle and initialize both sorts
  hs().shuffle();
  qs().shuffle();
  yield* all(
    hs().initialize(),
    qs().initialize(),
    heapSortLabelRef().opacity(1, 1),
    quickIntroSortRef().opacity(1, 1),
    heapGoodRef().opacity(1, 1),
    goodCaseRef().opacity(1, 1),
    badCaseRef().opacity(1, 1),
  );

  // Run both sorts in parallel
  yield* all(hs().sort(), qs().sort());

  yield* waitFor(1);

  let heapSortLabelRefClone = heapSortLabelRef().clone();
  heapSortLabelRefClone.opacity(0.33);

  let quickSortLabelRefClone = quickIntroSortRef().clone();
  quickSortLabelRefClone.opacity(0.33);

  view.add(heapSortLabelRefClone);
  view.add(quickSortLabelRefClone);

  // Transition to introsort: combine into one centered label
  yield* all(
    heapSortLabelRef().x(0, 1),
    heapSortLabelRef().y(heapSortLabelRef().y() - 100, 1),
    heapSortLabelRef().opacity(0, 1),
    heapSortLabelRef().scale(0.5, 1),
    quickIntroSortRef().x(0, 1),
    quickIntroSortRef().y(quickIntroSortRef().y() - 100, 1),
    quickIntroSortRef().scale(0.5, 1),
    quickIntroSortRef().opacity(0, 1),
    heapGoodRef().text('1% good', 1),
    badCaseRef().opacity(0, 1),
    goodCaseRef().x(x, 1),
    heapSortLabelRefClone.scale(0.75, 1),
    heapSortLabelRefClone.y(heapSortLabelRefClone.y() + 10, 1),
    heapSortLabelRefClone.opacity(1.0, 1),
    quickSortLabelRefClone.scale(0.75, 1),
    quickSortLabelRefClone.y(quickSortLabelRefClone.y() + 10, 1),
    quickSortLabelRefClone.opacity(1.0, 1),
    delay(0.4, introIntroSortRef().opacity(1, 0.6)),

    view.y(view.y() + 80, 1),
  );

  yield* waitFor(1);

  yield* all(
    hs().opacity(0.23, 1),
    heapGoodRef().opacity(0.5, 1),
    heapSortLabelRefClone.opacity(0.5, 1),
  );

  yield* waitFor(1);

  yield* all(
    ...qs().rectangles.map((rect, i) => delay(i * 0.02, rect().fill(Solarized.red, 1))),
  );

  yield* waitFor(1);

  yield* all(
    hs().opacity(1, 1),
    heapGoodRef().opacity(1, 1),
    heapSortLabelRefClone.opacity(1, 1),

    qs().opacity(0.23, 1),
    quickSortLabelRefClone.opacity(0.5, 1),
    goodCaseRef().opacity(0.5, 1),
  );

  yield* waitFor(1);
});
