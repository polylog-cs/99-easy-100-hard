import { CanvasStyle, Latex, LatexProps, Path } from '@motion-canvas/2d';
import { all, delay, TimingFunction } from '@motion-canvas/core';

import { FONT_FAMILY, Solarized } from './color';
import { TEXT_SIZE } from './text';

const factor = 2;
const buffer = 0.25;

export interface PolyLatexProps extends LatexProps {}

export class PolyLatex extends Latex {
  color: CanvasStyle;

  constructor(props: PolyLatexProps) {
    super({
      fontFamily: FONT_FAMILY,
      fill: Solarized.text,
      fontSize: TEXT_SIZE,
      ...props,
    });

    this.color = this.fill();
  }

  getPaths() {
    return this.childAs(0)
      .children()
      .flatMap((part) =>
        part.children().length ? (part.children() as Path[]) : part,
      ) as Path[];
  }

  private *animatePathWrite(
    path: Path,
    d: number,
    duration: number,
    timingFunction?: TimingFunction,
  ) {
    path.fill(null).stroke(this.color).lineWidth(40).start(0).end(0);
    yield* all(
      delay(d, path.end(1, duration, timingFunction)),
      delay(d + duration / factor, path.fill(this.color, duration, timingFunction)),
      delay(d + duration / factor, path.lineWidth(0, duration, timingFunction)),
    );
  }

  private *animatePathUnwrite(
    path: Path,
    d: number,
    duration: number,
    timingFunction?: TimingFunction,
  ) {
    path.lineWidth(0).stroke(this.color).start(0);
    yield* all(
      delay(d, path.fill(null, duration, timingFunction)),
      delay(d, path.lineWidth(40, duration, timingFunction)),
      delay(d + duration / factor, path.start(1, duration, timingFunction)),
    );
  }

  *write(time: number, timingFunction?: TimingFunction) {
    const paths = this.getPaths();
    const duration = time / paths.length;
    const animations = [];

    for (let i = 0; i < paths.length; i++) {
      animations.push(
        this.animatePathWrite(
          paths[i],
          (i * duration) / factor,
          duration,
          timingFunction,
        ),
      );
    }

    yield* all(...animations);
  }

  *unwrite(time: number, timingFunction?: TimingFunction) {
    const paths = this.getPaths();
    const duration = time / paths.length;
    const animations = [];

    for (let i = 0; i < paths.length; i++) {
      animations.push(
        this.animatePathUnwrite(
          paths[i],
          (i * duration) / factor,
          duration,
          timingFunction,
        ),
      );
    }

    yield* all(...animations);
  }
}
