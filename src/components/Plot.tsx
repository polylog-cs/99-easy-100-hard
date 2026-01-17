import { Layout, LayoutProps, Line, Txt } from '@motion-canvas/2d';
import { createSignal, SignalValue, SimpleSignal, Vector2 } from '@motion-canvas/core';

import { FONT_FAMILY, Solarized } from '../utilities/color';

export interface PlotProps extends LayoutProps {
  xMin?: SignalValue<number>;
  xMax?: SignalValue<number>;
  yMin?: SignalValue<number>;
  yMax?: SignalValue<number>;
  xTicks?: number[];
  yTicks?: number[];
  plotWidth?: number;
  plotHeight?: number;
  axisColor?: string;
  axisLineWidth?: number;
  tickLength?: number;
  labelFontSize?: number;
  labelColor?: string;
  xLabelFormatter?: (value: number) => string;
  yLabelFormatter?: (value: number) => string;
  showXAxis?: boolean;
  showYAxis?: boolean;
}

export class Plot extends Layout {
  public readonly xMin: SimpleSignal<number>;
  public readonly xMax: SimpleSignal<number>;
  public readonly yMin: SimpleSignal<number>;
  public readonly yMax: SimpleSignal<number>;
  public readonly plotWidth: number;
  public readonly plotHeight: number;

  constructor(props: PlotProps) {
    super({ ...props });

    const {
      xMin = -2.5,
      xMax = 2.5,
      yMin = -5,
      yMax = 25,
      xTicks = [],
      yTicks = [],
      plotWidth = 800,
      plotHeight = 600,
      axisColor = Solarized.text,
      axisLineWidth = 3,
      tickLength = 10,
      labelFontSize = 30,
      labelColor = Solarized.text,
      xLabelFormatter = (v) => v.toString(),
      yLabelFormatter = (v) => v.toString(),
      showXAxis = true,
      showYAxis = true,
    } = props;

    this.xMin = createSignal(xMin);
    this.xMax = createSignal(xMax);
    this.yMin = createSignal(yMin);
    this.yMax = createSignal(yMax);
    this.plotWidth = plotWidth;
    this.plotHeight = plotHeight;

    // Calculate origin position in screen space
    const originX = this.getScreenX(0);
    const originY = this.getScreenY(0);

    // X-axis
    if (showXAxis) {
      this.add(
        <Line
          points={[
            new Vector2(-plotWidth / 2, originY),
            new Vector2(plotWidth / 2, originY),
          ]}
          stroke={axisColor}
          lineWidth={axisLineWidth}
          endArrow
          arrowSize={12}
        />,
      );

      // X-axis ticks and labels
      for (const tick of xTicks) {
        const x = this.getScreenX(tick);
        this.add(
          <>
            <Line
              points={[
                new Vector2(x, originY - tickLength),
                new Vector2(x, originY + tickLength),
              ]}
              stroke={axisColor}
              lineWidth={axisLineWidth / 2}
            />
            <Txt
              text={xLabelFormatter(tick)}
              fontFamily={FONT_FAMILY}
              fontSize={labelFontSize}
              fill={labelColor}
              position={new Vector2(x, originY + tickLength + 25)}
            />
          </>,
        );
      }
    }

    // Y-axis
    if (showYAxis) {
      this.add(
        <Line
          points={[
            new Vector2(originX, plotHeight / 2),
            new Vector2(originX, -plotHeight / 2),
          ]}
          stroke={axisColor}
          lineWidth={axisLineWidth}
          endArrow
          arrowSize={12}
        />,
      );

      // Y-axis ticks and labels
      for (const tick of yTicks) {
        const y = this.getScreenY(tick);
        this.add(
          <>
            <Line
              points={[
                new Vector2(originX - tickLength, y),
                new Vector2(originX + tickLength, y),
              ]}
              stroke={axisColor}
              lineWidth={axisLineWidth / 2}
            />
            <Txt
              text={yLabelFormatter(tick)}
              fontFamily={FONT_FAMILY}
              fontSize={labelFontSize}
              fill={labelColor}
              position={new Vector2(originX - tickLength - 30, y)}
            />
          </>,
        );
      }
    }
  }

  /**
   * Convert plot space X coordinate to screen space
   */
  public getScreenX(plotX: number): number {
    const range = this.xMax() - this.xMin();
    return ((plotX - this.xMin()) / range - 0.5) * this.plotWidth;
  }

  /**
   * Convert plot space Y coordinate to screen space
   */
  public getScreenY(plotY: number): number {
    const range = this.yMax() - this.yMin();
    // Negate because screen Y increases downward
    return -((plotY - this.yMin()) / range - 0.5) * this.plotHeight;
  }

  /**
   * Convert plot space point to screen space
   */
  public getPointFromPlotSpace(plotX: number, plotY: number): Vector2 {
    return new Vector2(this.getScreenX(plotX), this.getScreenY(plotY));
  }

  /**
   * Generate an array of points for graphing a function
   * @param fn - The function to graph
   * @param samples - Number of sample points
   * @returns Array of Vector2 points in screen space
   */
  public makeGraphData(fn: (x: number) => number, samples: number = 200): Vector2[] {
    const points: Vector2[] = [];
    const xMin = this.xMin();
    const xMax = this.xMax();
    const step = (xMax - xMin) / samples;

    for (let i = 0; i <= samples; i++) {
      const x = xMin + i * step;
      const y = fn(x);
      points.push(this.getPointFromPlotSpace(x, y));
    }

    return points;
  }
}
