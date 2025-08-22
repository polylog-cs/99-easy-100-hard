import { Img, Layout, LayoutProps, Node, Rect } from '@motion-canvas/2d';
import {
  Color,
  createRef,
  Reference,
  useLogger,
  useRandom,
  Vector2,
  waitFor,
} from '@motion-canvas/core';

export const Solarized = {
  base03: '#002b36',
  base02: '#073642',
  base01: '#586e75',
  base00: '#657b83',
  base0: '#839496',
  base1: '#93a1a1',
  base2: '#eee8d5',
  base3: '#fdf6e3',
  yellow: '#d0b700',
  yellow2: '#b58900', // The original Solarized yellow
  orange: '#c1670c',
  orange2: '#cb4b16', // The original Solarized orange - too close to red
  red: '#dc322f',
  magenta: '#d33682',
  violet: '#6c71c4',
  blue: '#268bd2',
  cyan: '#2aa198',
  green: '#859900',

  background: '#eee8d5', // base2
  text: '#657b83', //  base00
  gray: '#657b83', //  base00
};

export const fontSize = 50;
export const FONT_FAMILY = 'Computer Modern Serif, Noto Color Emoji, sans-serif';
// sans-serif so that it's visible CMU hasn't loaded
// (if this has happened to you, just force a HMR update by touching a file)

/**
 * A nicer interpolation of colors using the 'lab' color space.
 */
export function colorLerp(from: any, to: any, value: number) {
  return Color.lerp(from, to, value, 'lab');
}
