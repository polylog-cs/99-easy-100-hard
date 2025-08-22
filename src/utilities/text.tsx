import { Txt, TxtProps } from '@motion-canvas/2d';
import { diffChars } from 'diff';

import { FONT_FAMILY, Solarized } from './color';

export const TEXT_SIZE: number = 50;

export class PolyTxt extends Txt {
  constructor(props: TxtProps) {
    super({
      fontFamily: FONT_FAMILY,
      fill: Solarized.text,
      fontSize: TEXT_SIZE,
      ...props,
    });
  }
}

/**
 * A smarter interpolation function for strings that takes into account the diff
 * and keeps the changes in the same order.
 *
 * Currently it looks a bit less smooth when inserting characters at the beginning
 * because that leads to the whole string being shifted by the centering.
 */
export function smartTextLerp(fromString: string, toString: string, value: number) {
  const changes = diffChars(fromString, toString);

  const totalChanges = changes
    .map((change) => (change.added || change.removed ? change.count : 0))
    .reduce((acc, change) => acc + change);

  let text = '';
  let changesToDo = value * totalChanges; // Note that this is a float

  for (const change of changes) {
    if (change.removed) {
      for (let i = 0; i < change.count; i++) {
        if (changesToDo > 0) {
          changesToDo--;
        } else {
          text += change.value[i];
        }
      }
    }

    if (change.added) {
      for (let i = 0; i < change.count; i++) {
        if (changesToDo > 0) {
          text += change.value[i];
          changesToDo--;
        }
      }
    }

    if (!change.added && !change.removed) {
      text += change.value;
    }
  }

  return text;
}

/**
 * An instant text replacement function that immediately switches from one text to another
 * based on the interpolation value.
 *
 * @param fromString - The starting text
 * @param toString - The target text
 * @param value - Interpolation value (0 = fromString, 1 = toString)
 * @returns The appropriate text based on the value threshold
 */
export function instantTextLerp(
  fromString: string,
  toString: string,
  value: number,
): string {
  // At value >= 0.5, switch to the target string, otherwise keep the original
  return value >= 0.5 ? toString : fromString;
}
