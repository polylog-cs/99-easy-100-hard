import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, createRefArray, delay, waitFor } from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const patrons = [
    'Aaron Schultz',
    'Adam Dřínek',
    'Agam',
    'Amit Nambiar',
    'Anh Dung Le',
    'A Patreon of the Ahts',
    'C P',
    'Deepan Saravanan',
    'Esen Özbay',
    'George Chahir',
    'George Mihaila',
    'Hugo Madge León',
    'Jiří Nádvorník',
    'Joe Chen',
    'lazypikachu23',
    'Matthew Aeschbacher',
    'Mika chu',
    'Pavel Klavík',
    'Pepa Tkadlec',
    'Sinan Taifour',
    'sjbtrn',
    'Sophie Huiberts',
    'Thomas Dubach',
    'Tomas Klos',
    'Tommy',
  ];

  const nColumns = 3;

  const patronsRef = createRefArray<PolyTxt>();

  view.add(
    <Layout layout gap={90} direction={'column'} opacity={1}>
      <PolyTxt
        ref={patronsRef}
        text={'Thank you to our patrons!'}
        fontSize={100}
        fill={Solarized.text}
        opacity={0}
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
                  opacity={0}
                  ref={patronsRef}
                />
              ))}
          </Layout>
        ))}
      </Layout>
    </Layout>,
  );

  yield* patronsRef[0].opacity(1, 1);

  yield* all(...patronsRef.map((ref, i) => delay(i * 0.05, ref.opacity(1, 1))));

  yield* waitFor(2);
});
