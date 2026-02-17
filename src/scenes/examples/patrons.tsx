import { Layout, makeScene2D } from '@motion-canvas/2d';
import { all, createRefArray, delay, waitFor } from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { appear } from '../../utilities/creation';
import { PolyTxt } from '../../utilities/text';
import patronsCsv from './patrons.csv?raw';

// Parse CSV handling quoted fields
function parseCSVRow(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

const patronRows = patronsCsv.split('\n').filter((l) => l.trim());
const patronNames = patronRows
  .slice(1)
  .map((row) => parseCSVRow(row))
  .filter((fields) => fields[3]?.trim() === 'Active patron')
  .map((fields) => fields[0]?.trim())
  .filter(Boolean)
  .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

export default makeScene2D(function* (view) {
  const random = useRandom();

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
