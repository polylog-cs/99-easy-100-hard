import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, createRef, sequence, waitFor } from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  // TODO real names
  const patrons = [
    'Sampo Lavinen',
    'Tuomas Artman',
    'Janne Harju',
    'Matti Luukkainen',
    'Jussi Kukkonen',
    'Juho Vepsalainen',
  ];

  const nColumns = 2;

  view.add(
    <Layout layout gap={40} direction={'column'}>
      <PolyTxt
        // ref={complicatedText}
        text={'Thank you to our patrons!'}
        fontSize={100}
        fill={Solarized.text}
        opacity={1}
      />
      <Layout layout gap={40} direction={'row'} justifyContent={'space-between'}>
        {Array.from({ length: nColumns }, (_, colIdx) => (
          <Layout layout gap={10} direction={'column'}>
            {patrons
              .filter((_, idx) => idx % nColumns === colIdx)
              .map((patron) => (
                <PolyTxt
                  text={patron}
                  fontSize={50}
                  fill={Solarized.text}
                  opacity={1}
                />
              ))}
          </Layout>
        ))}
      </Layout>
    </Layout>,
  );

  yield* waitFor(2);
});
