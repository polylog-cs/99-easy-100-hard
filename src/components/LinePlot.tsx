import { Line, Node, NodeProps } from '@motion-canvas/2d';
import {
  all,
  createRef,
  createSignal,
  SignalValue,
  SimpleSignal,
  ThreadGenerator,
  Vector2,
} from '@motion-canvas/core';

import { Solarized } from '../utilities/color';
import { Plot } from './Plot';

export interface LinePlotProps extends NodeProps {
  plot: Plot;
  fn: (x: number) => number;
  stroke?: SignalValue<string>;
  lineWidth?: SignalValue<number>;
  samples?: number;
}

export class LinePlot extends Node {
  private readonly line = createRef<Line>();
  private readonly plot: Plot;
  private readonly fn: (x: number) => number;
  private readonly samples: number;
  private readonly baseLineWidth: number;

  public readonly start: SimpleSignal<number>;
  public readonly end: SimpleSignal<number>;

  constructor(props: LinePlotProps) {
    super({ ...props });

    const { plot, fn, stroke = Solarized.red, lineWidth = 4, samples = 200 } = props;

    this.plot = plot;
    this.fn = fn;
    this.samples = samples;
    this.baseLineWidth = typeof lineWidth === 'number' ? lineWidth : 4;

    this.start = createSignal(0);
    this.end = createSignal(0);

    const points = this.plot.makeGraphData(this.fn, this.samples);

    this.add(
      <Line
        ref={this.line}
        points={points}
        stroke={stroke}
        lineWidth={lineWidth}
        start={() => this.start()}
        end={() => this.end()}
      />,
    );
  }

  /**
   * Animate drawing the curve from start to end
   */
  public *animateDraw(duration: number = 1): ThreadGenerator {
    yield* this.end(1, duration);
  }

  /**
   * Animate erasing the curve
   */
  public *erase(duration: number = 1): ThreadGenerator {
    yield* this.start(1, duration);
  }

  /**
   * Get the screen position for a given x value on the curve
   */
  public getPointAt(x: number): Vector2 {
    return this.plot.getPointFromPlotSpace(x, this.fn(x));
  }

  /**
   * Highlight the curve by increasing stroke width
   */
  public *highlight(duration: number = 0.3, scale: number = 2.5): ThreadGenerator {
    yield* this.line().lineWidth(this.baseLineWidth * scale, duration);
  }

  /**
   * Unhighlight the curve by returning to base stroke width
   */
  public *unhighlight(duration: number = 0.3): ThreadGenerator {
    yield* this.line().lineWidth(this.baseLineWidth, duration);
  }

  /**
   * Pulse highlight: highlight then unhighlight
   */
  public *pulseHighlight(duration: number = 0.6, scale: number = 2.5): ThreadGenerator {
    yield* this.highlight(duration / 2, scale);
    yield* this.unhighlight(duration / 2);
  }
}
