import { Layout, Line, makeScene2D, Rect, Txt } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  fadeTransition,
  sequence,
} from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  yield fadeTransition(0.5);

  view.fill(Solarized.background);
  yield* beginSlide('comparison table');

  const table = createRef<Layout>();
  const columnWidth = 400;
  const rowHeight = 80;
  const borderColor = Solarized.base01;
  const borderWidth = 3;

  // Table data
  const headers = ['', 'Slow, 100%', 'Fast, 99%'];
  const rows = [
    ['CD checking', 'Send all data', 'Checksum'],
    ['Equations', 'Multiply out', 'Plug and check'],
    ['Quicksort', 'Shuffle input', 'First-index pivot'],
  ];

  // Create refs for all text elements
  const headerRefs = headers.map(() => createRef<PolyTxt>());
  const rowRefs = rows.map((row) => row.map(() => createRef<PolyTxt>()));

  view.add(
    <Layout ref={table} layout direction={'column'} opacity={1} scale={1.3}>
      {/* Header row */}
      <Layout layout direction={'row'}>
        {headers.map((header, colIndex) => (
          <Rect
            width={colIndex === 0 ? columnWidth / 1.1 : columnWidth}
            height={rowHeight * 1.3}
          >
            <PolyTxt
              ref={headerRefs[colIndex]}
              text={header}
              fontSize={55}
              fill={Solarized.base00}
              fontWeight={700}
            />
          </Rect>
        ))}
      </Layout>

      {/* Data rows */}
      {rows.map((row, rowIndex) => (
        <Layout layout direction={'row'}>
          {row.map((cell, colIndex) => (
            <Rect
              width={colIndex === 0 ? columnWidth / 1.1 : columnWidth}
              height={rowHeight}
            >
              <PolyTxt
                ref={rowRefs[rowIndex][colIndex]}
                text={cell}
                fontSize={45}
                fill={colIndex === 0 ? Solarized.base00 : Solarized.base01}
                fontWeight={colIndex === 0 ? 600 : 400}
                opacity={0}
                scale={0}
              />
            </Rect>
          ))}
        </Layout>
      ))}
    </Layout>,
  );

  for (const row of rowRefs) {
    yield* all(
      sequence(
        0.25,
        ...row.flat().map((ref) => all(ref().opacity(1, 1), ref().scale(1, 1))),
        //  ...row.flat().map((ref) => {
        //    let text = ref().text();
        //    ref().text('');

        //    return all(ref().text(text, 1), ref().opacity(1, 1));
        //  }),
      ),
    );
  }

  yield* beginSlide('comparison table end');
});
