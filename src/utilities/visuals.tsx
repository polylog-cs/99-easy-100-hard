import { Circle, Shape } from '@motion-canvas/2d';
import { createRef, Reference } from '@motion-canvas/core';

import { Solarized } from './color';

export function createShadow(
  target: Reference<Shape>,
  options?: {
    ref?: Reference<Circle>;
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
    ref = null,
    opacity = 0.15,
    offsetY = 10,
    widthRatio = 5 / 5,
    heightRatio = 1 / 4,
    fill = Solarized.base03,
  } = options || {};

  const shadow = ref || createRef<Circle>();

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
      zIndex={-1}
    />
  );

  // Apply blur filter
  shadow().filters.blur(blur);

  return shadowElement;
}
