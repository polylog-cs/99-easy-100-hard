import { Line, Node, NodeProps } from '@motion-canvas/2d';
import {
  all,
  createRef,
  linear,
  loop,
  Thread,
  ThreadGenerator,
  Vector2,
} from '@motion-canvas/core';

import { Solarized } from '../utilities/color';

export interface UploadLineProps extends NodeProps {
  startPoint: Vector2;
  endPoint: Vector2;
  lineWidth?: number;
  stroke?: string;
  lineDash?: number[];
}

export class UploadLine extends Node {
  private readonly line = createRef<Line>();
  private readonly startPoint: Vector2;
  private readonly endPoint: Vector2;
  private dashingTask: Generator<any, void, unknown> | null = null;

  public constructor(props: UploadLineProps) {
    super({ ...props });

    const {
      startPoint,
      endPoint,
      lineWidth = 10,
      stroke = Solarized.cyan, // Solarized base01
      lineDash = [50, 10, 10, 10],
    } = props;

    this.startPoint = startPoint;
    this.endPoint = endPoint;

    this.add(
      <Line
        ref={this.line}
        zIndex={-1}
        lineDash={lineDash}
        points={[startPoint, startPoint]} // Initially both points are the same
        lineWidth={lineWidth}
        stroke={stroke}
      />,
    );
  }

  public upload(): ThreadGenerator {
    return loop(() =>
      this.line()
        .lineDashOffset(0)
        .lineDashOffset(
          this.line()
            .lineDash()
            .reduce((a, c) => a + c, 0),
          0.15,
          linear,
        ),
    );
  }

  public *start(duration: number = 1): ThreadGenerator {
    // Animate the line from start point to end point
    yield* all(this.line().points([this.endPoint, this.startPoint], duration));
  }

  public *stop(duration: number = 1): ThreadGenerator {
    // Animate the line to disappear by moving start point to end point
    yield* this.line().points([this.endPoint, this.endPoint], duration);
  }
}
