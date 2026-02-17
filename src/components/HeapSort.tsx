import { Layout, LayoutProps, Rect } from '@motion-canvas/2d';
import {
  all,
  Color,
  createRef,
  createSignal,
  Reference,
  sequence,
  SimpleSignal,
  ThreadGenerator,
  useLogger,
  useRandom,
} from '@motion-canvas/core';

import { Solarized } from '../utilities/color';
import { PolyTxt } from '../utilities/text';

export interface HeapSortProps extends LayoutProps {
  elementCount?: number;
  elementWidth?: number;
  elementGap?: number;
  animationSpeed?: number;
  colors?: {
    sorted?: Color;
    active?: Color;
    heapified?: Color;
    default?: Color;
  };
}

export class HeapSort extends Layout {
  readonly rectangles: Array<Reference<Rect>> = [];
  private readonly elementsLayout = createRef<Layout>();
  private readonly comparisonCounter = createRef<PolyTxt>();
  private readonly values: number[] = [];
  private readonly value_signals: SimpleSignal<number>[] = [];
  public readonly sortedIndices = new Set<number>();
  private readonly random = useRandom();
  public comparisonCount: number = 0;

  public readonly elementCount: number;
  public animationSpeed: number;
  private readonly elementGap: number;
  private readonly colors: {
    sorted: Color;
    active: Color;
    heapified: Color;
    default: Color;
  };

  public constructor(props: HeapSortProps = {}) {
    const {
      elementCount = 12,
      elementWidth,
      elementGap = 20,
      animationSpeed = 0.3,
      colors = {},
      ...layoutProps
    } = props;

    super({
      width: 1400,
      height: 800,
      ...layoutProps,
    });

    this.elementCount = elementCount;
    this.animationSpeed = animationSpeed;
    this.elementGap = elementGap;
    this.colors = {
      sorted: colors.sorted ?? Solarized.green,
      active: colors.active ?? Solarized.yellow,
      heapified: colors.heapified ?? Solarized.cyan,
      default: colors.default ?? Solarized.text,
    };

    // Initialize rectangles and values
    this.rectangles = Array.from({ length: elementCount }, () => createRef<Rect>());
    this.values = Array.from(
      { length: elementCount },
      (_, i) => (i + 1) / elementCount,
    );
    this.value_signals = Array.from({ length: elementCount }, (_, i) =>
      createSignal(0),
    );

    this.add(
      <Layout layout={false}>
        {/* Comparison counter display */}
        <PolyTxt
          ref={this.comparisonCounter}
          text={() => `${this.comparisonCount}`}
          fontSize={this.height() / 1.7}
          fontFamily={'monospace'}
          opacity={0}
          zIndex={1}
        />
        {/* Layout for the elements */}
        <Layout
          ref={this.elementsLayout}
          layout
          gap={this.elementGap}
          width={() => this.width()}
          height={() => this.height()}
          alignItems={'end'}
        >
          {this.rectangles.map((ref, i) => (
            <Rect
              ref={ref}
              grow={1}
              width={() =>
                elementWidth ??
                (this.width() - (elementCount - 1) * this.elementGap) / elementCount
              }
              stroke={this.colors.default}
              fill={this.colors.default}
              height={() => this.value_signals[i]() * this.height() * this.values[i]}
            />
          ))}
        </Layout>
      </Layout>,
    );
  }

  // ── Shared methods (same as QuickSort) ──────────────────────────────

  public shuffle(): void {
    this.shuffleArray(this.values);
    this.sortedIndices.clear();
    this.comparisonCount = 0;
  }

  public *shuffleAnimated(time: number = 1): ThreadGenerator {
    for (let i = this.values.length - 1; i > 0; i--) {
      let j = Math.floor(this.random.nextFloat() * (i + 1));
      while (j === i) {
        j = Math.floor(this.random.nextFloat() * (i + 1));
      }
      yield* this.swapElements(i, j, time);
    }
  }

  public *initialize(delay = 0.025, duration = 1): ThreadGenerator {
    yield* sequence(
      delay,
      ...this.rectangles.map((ref, i) => this.value_signals[i](1, duration)),
    );
  }

  public *uninitialize(delay = 0.025, duration = 1): ThreadGenerator {
    yield* sequence(
      delay,
      ...this.rectangles.map((ref, i) => this.value_signals[i](0, duration)),
    );
  }

  public *showComparisonCount(color: Color | string = Solarized.text): ThreadGenerator {
    yield* all(
      this.comparisonCounter().opacity(1, 0.5),
      this.comparisonCounter().fill(color, 0.5),
      this.elementsLayout().opacity(0.5, 0.5),
    );
  }

  public *hideComparisonCount(): ThreadGenerator {
    yield* this.comparisonCounter().opacity(0, 0.5);
  }

  public *reset(): ThreadGenerator {
    useLogger().info(`${this.values}`);
    this.sortedIndices.clear();
    this.comparisonCount = 0;
    yield* all(
      ...this.rectangles.map((ref, i) =>
        all(
          ref().fill(this.colors.default, 0.5),
          ref().opacity(1, 0.5),
          ref().height(this.values[i] * this.elementsLayout().height(), 0.5),
        ),
      ),
    );
  }

  public getValues(): number[] {
    return [...this.values];
  }

  public getComparisonCount(): number {
    return this.comparisonCount;
  }

  public setValues(newValues: number[], normalize: boolean = false): void {
    if (newValues.length !== this.elementCount) {
      throw new Error(
        `Values array length (${newValues.length}) must match element count (${this.elementCount})`,
      );
    }
    const max = Math.max(...newValues);
    if (max === 0) {
      throw new Error('Maximum value in newValues must be greater than 0');
    }
    if (normalize) {
      const normalized = newValues.map((v) => v / max);
      this.values.splice(0, this.values.length, ...normalized);
    } else {
      this.values.splice(0, this.values.length, ...newValues);
    }
    this.sortedIndices.clear();
    this.comparisonCount = 0;
  }

  private shuffleArray(array: number[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(this.random.nextFloat() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private *swapElements(i: number, j: number, duration: number): ThreadGenerator {
    const rectI = this.rectangles[i]();
    const rectJ = this.rectangles[j]();

    const heightI = this.values[i] * this.height();
    const heightJ = this.values[j] * this.height();

    yield* all(rectI.opacity(0.0, 0), rectJ.opacity(0.0, 0));

    const cloneI = createRef<Rect>();
    const cloneJ = createRef<Rect>();

    const colorI = rectI.fill();
    const colorJ = rectJ.fill();

    rectI
      .parent()
      .parent()
      .add(
        <Rect
          ref={cloneI}
          width={rectI.width}
          height={rectI.height}
          fill={rectI.fill}
          stroke={rectI.stroke}
          opacity={1}
          zIndex={10}
        />,
      );

    rectJ
      .parent()
      .parent()
      .add(
        <Rect
          ref={cloneJ}
          width={rectJ.width}
          height={rectJ.height}
          fill={rectJ.fill}
          stroke={rectJ.stroke}
          opacity={1}
          zIndex={10}
        />,
      );

    cloneI().absolutePosition(rectI.absolutePosition());
    cloneJ().absolutePosition(rectJ.absolutePosition());

    const bottomI = rectI.bottom();
    const bottomJ = rectJ.bottom();

    yield* all(
      cloneI().bottom(bottomJ, duration),
      cloneJ().bottom(bottomI, duration),
    );

    [this.values[i], this.values[j]] = [this.values[j], this.values[i]];

    yield* all(
      rectI.height(this.values[i] * this.height(), 0),
      rectJ.height(this.values[j] * this.height(), 0),
      rectI.fill(colorJ, 0),
      rectJ.fill(colorI, 0),
      rectI.opacity(1, 0),
      rectJ.opacity(1, 0),
    );

    cloneI().remove();
    cloneJ().remove();

    rectI.height(() => this.value_signals[i]() * this.height() * this.values[i]);
    rectJ.height(() => this.value_signals[j]() * this.height() * this.values[j]);
  }

  // ── HeapSort-specific methods ───────────────────────────────────────

  public *setHeapSortColors(
    heapSize: number,
    activeIdx1: number | null,
    activeIdx2: number | null,
    duration: number,
  ): ThreadGenerator {
    yield* all(
      ...this.rectangles.map((ref, idx) => {
        let targetColor = this.colors.default;
        let targetOpacity = 1;

        if (this.sortedIndices.has(idx)) {
          targetColor = this.colors.sorted;
        } else if (activeIdx1 !== null && idx === activeIdx1) {
          targetColor = this.colors.active;
        } else if (activeIdx2 !== null && idx === activeIdx2) {
          targetColor = this.colors.active;
        } else if (idx < heapSize) {
          targetColor = this.colors.heapified;
        }

        return all(
          ref().fill(targetColor, duration),
          ref().opacity(targetOpacity, duration),
        );
      }),
    );
  }

  private *siftDown(start: number, end: number): ThreadGenerator {
    let root = start;

    while (2 * root + 1 <= end) {
      const leftChild = 2 * root + 1;
      const rightChild = 2 * root + 2;
      let swap = root;

      // Compare root with left child
      this.comparisonCount++;
      yield* this.setHeapSortColors(end + 1, root, leftChild, this.animationSpeed);
      if (this.values[swap] < this.values[leftChild]) {
        swap = leftChild;
      }

      // Compare with right child if it exists
      if (rightChild <= end) {
        this.comparisonCount++;
        yield* this.setHeapSortColors(end + 1, swap, rightChild, this.animationSpeed);
        if (this.values[swap] < this.values[rightChild]) {
          swap = rightChild;
        }
      }

      if (swap === root) {
        break;
      }

      yield* this.swapElements(root, swap, this.animationSpeed);
      root = swap;
    }
  }

  private *heapsort(): ThreadGenerator {
    const n = this.elementCount;

    // Build max heap
    for (let i = Math.floor((n - 2) / 2); i >= 0; i--) {
      yield* this.siftDown(i, n - 1);
    }

    // Show fully heapified state
    yield* this.setHeapSortColors(n, null, null, this.animationSpeed);

    // Extract max elements
    for (let end = n - 1; end > 0; end--) {
      yield* this.swapElements(0, end, this.animationSpeed);
      this.sortedIndices.add(end);
      yield* this.setHeapSortColors(end, null, null, this.animationSpeed);
      yield* this.siftDown(0, end - 1);
    }

    // Mark the last remaining element as sorted
    this.sortedIndices.add(0);
  }

  public *sort(
    duration: number = 1,
    animationSpeed?: number,
  ): ThreadGenerator {
    this.sortedIndices.clear();
    this.comparisonCount = 0;

    const originalSpeed = this.animationSpeed;
    if (animationSpeed !== undefined) {
      this.animationSpeed = animationSpeed;
    }

    yield* this.heapsort();

    this.animationSpeed = originalSpeed;

    // Final animation - show all elements as sorted
    yield* all(
      ...this.rectangles.map((ref) =>
        all(ref().fill(this.colors.sorted, duration), ref().opacity(1, duration)),
      ),
    );
  }
}
