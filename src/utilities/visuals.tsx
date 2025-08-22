import { Circle, Shape } from '@motion-canvas/2d';
import { createRef, Reference } from '@motion-canvas/core';

import { Solarized } from './color';

export function createShadow(
  target: Reference<Shape>,
  options?: {
    blur?: number;
    opacity?: number;
    offsetY?: number;
    widthRatio?: number;
    heightRatio?: number;
    fill?: string;
    stroke?: string;
  },
) {
  const {
    blur = 20,
    opacity = 0.15,
    offsetY = 0,
    widthRatio = 4 / 5,
    heightRatio = 1 / 3,
    fill = Solarized.base03,
  } = options || {};

  const shadow = createRef<Circle>();

  const shadowElement = (
    <Circle
      ref={shadow}
      width={() => target().width() * widthRatio}
      height={() => target().height() * heightRatio}
      position={() =>
        target()
          .position()
          .addY(target().height() / 2 + offsetY)
      }
      fill={fill}
      scale={() => target().scale().mul(target().opacity())}
      opacity={opacity}
    />
  );

  // Apply blur filter
  shadow().filters.blur(blur);

  return shadowElement;
}
