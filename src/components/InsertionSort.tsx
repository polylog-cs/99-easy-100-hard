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

export interface InsertionSortProps extends LayoutProps {
  elementCount?: number;
  elementWidth?: number;
  elementGap?: number;
  animationSpeed?: number;
  colors?: {
    sorted?: Color;
    current?: Color;
    comparing?: Color;
    default?: Color;
  };
}

export class InsertionSort extends Layout {
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
    current: Color;
    comparing: Color;
    default: Color;
  };

  public constructor(props: InsertionSortProps = {}) {
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
      current: colors.current ?? Solarized.yellow,
      comparing: colors.comparing ?? Solarized.cyan,
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

  // ── InsertionSort-specific methods ──────────────────────────────────

  public *setInsertionSortColors(
    sortedEnd: number,
    currentIdx: number | null,
    comparingIdx: number | null,
    duration: number,
  ): ThreadGenerator {
    yield* all(
      ...this.rectangles.map((ref, idx) => {
        let targetColor = this.colors.default;

        if (currentIdx !== null && idx === currentIdx) {
          targetColor = this.colors.current;
        } else if (comparingIdx !== null && idx === comparingIdx) {
          targetColor = this.colors.comparing;
        } else if (idx <= sortedEnd) {
          targetColor = this.colors.sorted;
        }

        return ref().fill(targetColor, duration);
      }),
    );
  }

  /**
   * Shift element from position `from` to position `to` (from > to),
   * sliding everything in between one position to the right.
   * Uses clone-based animation like swapElements.
   */
  private *shiftElement(from: number, to: number, duration: number): ThreadGenerator {
    if (from === to) return;

    // Collect all indices involved: from, and to..from-1
    const indices: number[] = [];
    for (let k = to; k <= from; k++) {
      indices.push(k);
    }

    // Hide all originals
    yield* all(...indices.map((k) => this.rectangles[k]().opacity(0, 0)));

    // Create clones for each involved element
    const clones: Reference<Rect>[] = [];
    const colors: any[] = [];
    const bottoms: any[] = [];

    for (const k of indices) {
      const rect = this.rectangles[k]();
      const clone = createRef<Rect>();
      colors.push(rect.fill());
      bottoms.push(rect.bottom());

      rect
        .parent()
        .parent()
        .add(
          <Rect
            ref={clone}
            width={rect.width}
            height={rect.height}
            fill={rect.fill}
            stroke={rect.stroke}
            opacity={1}
            zIndex={10}
          />,
        );

      clone().absolutePosition(rect.absolutePosition());
      clones.push(clone);
    }

    // Animate: element at `from` moves to `to` position,
    // elements at to..from-1 each shift right by one
    // indices[0] = to, indices[last] = from
    // clones[last] is the element being inserted (moves to position `to`)
    // clones[0..last-1] are elements that shift right by one position
    const lastCloneIdx = clones.length - 1;
    const animations: ThreadGenerator[] = [];

    // The inserted element (from) moves to position `to`
    animations.push(clones[lastCloneIdx]().bottom(bottoms[0], duration));

    // Each element in to..from-1 shifts right by one (to its +1 neighbor's bottom)
    for (let c = 0; c < lastCloneIdx; c++) {
      animations.push(clones[c]().bottom(bottoms[c + 1], duration));
    }

    yield* all(...animations);

    // Update values array: save value at `from`, shift to..from-1 right, place at `to`
    const insertedValue = this.values[from];
    for (let k = from; k > to; k--) {
      this.values[k] = this.values[k - 1];
    }
    this.values[to] = insertedValue;

    // Restore originals with new values and colors
    // colors[] is indexed by (original position - to), so:
    //   colors[0] = original color at position `to`
    //   colors[1] = original color at position `to+1`
    //   ...
    //   colors[lastCloneIdx] = original color at position `from`
    // After the shift:
    //   position `to` gets colors[lastCloneIdx] (the inserted element)
    //   position `to+1` gets colors[0] (shifted from `to`)
    //   position `to+k` gets colors[k-1]
    const restoreAnims: ThreadGenerator[] = [];
    for (const k of indices) {
      const rect = this.rectangles[k]();
      let srcColorIdx: number;
      if (k === to) {
        srcColorIdx = lastCloneIdx;
      } else {
        srcColorIdx = k - to - 1;
      }

      restoreAnims.push(
        rect.height(this.values[k] * this.height(), 0),
        rect.fill(colors[srcColorIdx], 0),
        rect.opacity(1, 0),
      );
    }
    yield* all(...restoreAnims);

    // Remove clones
    for (const clone of clones) {
      clone().remove();
    }

    // Rebind signal heights
    for (const k of indices) {
      const rect = this.rectangles[k]();
      rect.height(() => this.value_signals[k]() * this.height() * this.values[k]);
    }
  }

  private *insertionSort(): ThreadGenerator {
    const n = this.elementCount;

    // Mark index 0 as sorted
    this.sortedIndices.add(0);
    yield* this.setInsertionSortColors(0, null, null, this.animationSpeed);

    for (let i = 1; i < n; i++) {
      const currentValue = this.values[i];

      // Highlight the current element being inserted
      yield* this.setInsertionSortColors(i - 1, i, null, this.animationSpeed);

      // Scan left to find insertion position
      let insertPos = i;
      for (let j = i - 1; j >= 0; j--) {
        this.comparisonCount++;
        yield* this.setInsertionSortColors(i - 1, i, j, this.animationSpeed);

        if (this.values[j] <= currentValue) {
          insertPos = j + 1;
          break;
        }
        if (j === 0) {
          insertPos = 0;
        }
      }

      // Shift element to insertion position
      if (insertPos < i) {
        yield* this.shiftElement(i, insertPos, this.animationSpeed);
      }

      // Mark 0..i as sorted
      for (let k = 0; k <= i; k++) {
        this.sortedIndices.add(k);
      }
      yield* this.setInsertionSortColors(i, null, null, this.animationSpeed);
    }
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

    yield* this.insertionSort();

    this.animationSpeed = originalSpeed;

    // Final animation - show all elements as sorted
    yield* all(
      ...this.rectangles.map((ref) =>
        all(ref().fill(this.colors.sorted, duration), ref().opacity(1, duration)),
      ),
    );
  }
}
