import { Layout, LayoutProps, Rect, Shape, Txt } from '@motion-canvas/2d';
import {
  all,
  Color,
  createRef,
  easeInOutCubic,
  Reference,
  sequence,
  ThreadGenerator,
  useLogger,
  useRandom,
} from '@motion-canvas/core';

import { colorLerp, Solarized } from '../utilities/color';
import { PolyTxt } from '../utilities/text';

export interface QuickSortProps extends LayoutProps {
  elementCount?: number;
  elementWidth?: number;
  elementGap?: number;
  animationSpeed?: number;
  colors?: {
    sorted?: Color;
    pivot?: Color;
    active?: Color;
    lessThanPivot?: Color;
    default?: Color;
  };
}

export type PivotStrategy = 'first' | 'last' | 'mo3' | 'random';

export class QuickSort extends Layout {
  private readonly rectangles: Array<Reference<Rect>> = [];
  private readonly pivotLine = createRef<Rect>();
  private readonly elementsLayout = createRef<Layout>();
  private readonly comparisonCounter = createRef<PolyTxt>();
  private readonly values: number[] = [];
  private readonly sortedIndices = new Set<number>();
  private readonly random = useRandom();
  public comparisonCount: number = 0;
  private pivotStrategy: PivotStrategy = 'last';

  private readonly elementCount: number;
  private readonly animationSpeed: number;
  private readonly elementGap: number;
  private readonly colors: {
    sorted: Color;
    pivot: Color;
    active: Color;
    lessThanPivot: Color;
    default: Color;
  };

  public constructor(props: QuickSortProps = {}) {
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
      pivot: colors.pivot ?? Solarized.blue,
      active: colors.active ?? Solarized.yellow,
      lessThanPivot: colors.lessThanPivot ?? Solarized.blue,
      default: colors.default ?? Solarized.text,
    };

    // Initialize rectangles and values
    this.rectangles = Array.from({ length: elementCount }, () => createRef<Rect>());
    this.values = Array.from(
      { length: elementCount },
      (_, i) => (i + 1) / elementCount,
    );

    const calculatedWidth =
      elementWidth ?? (this.width() - (elementCount - 1) * elementGap) / elementCount;

    this.add(
      <Layout layout={false}>
        <Rect
          ref={this.pivotLine}
          fill={this.colors.pivot}
          opacity={0}
          height={0}
          width={0}
          zIndex={-1}
        />
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
          gap={elementGap}
          width={this.width()}
          height={this.height()}
          alignItems={'end'}
        >
          {this.rectangles.map((ref) => (
            <Rect
              ref={ref}
              grow={1}
              width={calculatedWidth}
              stroke={this.colors.default}
              fill={this.colors.default}
              height={0}
            />
          ))}
        </Layout>
      </Layout>,
    );
  }

  /**
   * Shuffle the array and reset the visualization
   */
  public shuffle(): void {
    this.shuffleArray(this.values);
    this.sortedIndices.clear();
    this.comparisonCount = 0;
  }

  /**
   * Initialize the visualization with current values
   * @param delay - Delay between each element animation (default: 0.025)
   * @param duration - Duration for each element's height animation (default: 1)
   */
  public *initialize(delay = 0.025, duration = 1): ThreadGenerator {
    yield* sequence(
      delay,
      ...this.rectangles.map((ref, i) =>
        ref().height(this.values[i] * this.height(), duration),
      ),
    );
  }
  /**
   * Uninitialize the visualization by animating rectangles back to zero height
   * @param delay - Delay between each element animation (default: 0.025)
   * @param duration - Duration for each element's height animation (default: 1)
   */
  public *uninitialize(delay = 0.025, duration = 1): ThreadGenerator {
    yield* sequence(
      delay,
      ...this.rectangles.map((ref, i) => ref().height(0, duration)),
    );
  }

  /**
   * Show the comparison count display
   */
  public *showComparisonCount(color: Color | string = Solarized.text): ThreadGenerator {
    yield* all(
      this.comparisonCounter().opacity(1, 0.5),
      this.comparisonCounter().fill(color, 0.5),
      this.elementsLayout().opacity(0.5, 0.5),
    );
  }

  /**
   * Hide the comparison count display
   */
  public *hideComparisonCount(): ThreadGenerator {
    yield* this.comparisonCounter().opacity(0, 0.5);
  }

  /**
   * Run the complete quicksort animation
   * @param strategy - Pivot selection strategy: 'last', 'mo3' (median of three), or 'random'
   * @param duration - Duration for the final sorted animation (default: 1)
   * @param animationSpeed - Speed multiplier for all sorting animations (default: uses constructor value)
   */
  public *sort(
    strategy: PivotStrategy = 'last',
    duration: number = 1,
    animationSpeed?: number,
  ): ThreadGenerator {
    this.sortedIndices.clear();
    this.comparisonCount = 0;
    this.pivotStrategy = strategy;

    // Temporarily override animation speed if provided
    const originalSpeed = this.animationSpeed;
    if (animationSpeed !== undefined) {
      this.animationSpeed = animationSpeed;
    }

    yield* this.quicksort(0, this.elementCount - 1);

    // Restore original animation speed
    this.animationSpeed = originalSpeed;

    // Final animation - show all elements as sorted
    yield* all(
      ...this.rectangles.map((ref) =>
        all(ref().fill(this.colors.sorted, duration), ref().opacity(1, duration)),
      ),
    );
  }

  /**
   * Reset the visualization to initial state
   */
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

  /**
   * Get current values array
   */
  public getValues(): number[] {
    return [...this.values];
  }

  /**
   * Get current comparison count
   */
  public getComparisonCount(): number {
    return this.comparisonCount;
  }

  /**
   * Set custom values (must match element count)
   */
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

  // Private helper methods

  private shuffleArray(array: number[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(this.random.nextFloat() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  public almostSort() {
    const elements = this.getValues();
    const sorted = [...Array(this.elementCount)].map(
      (_, i) => i / (this.elementCount - 1),
    );

    const numFlips = 4;

    for (let i = 0; i < numFlips; i++) {
      const pos1 = Math.floor(this.random.nextFloat() * sorted.length);
      const distance = 1;
      let pos2 = pos1 + (this.random.nextFloat() < 0.5 ? distance : -distance);

      pos2 = Math.max(0, Math.min(sorted.length - 1, pos2));

      [sorted[pos1], sorted[pos2]] = [sorted[pos2], sorted[pos1]];
    }

    this.setValues(sorted);
  }

  /**
   * Arrange elements in a pyramid pattern:
   * - Smallest at index 1
   * - Second smallest at last index
   * - Third smallest at index 2
   * - Fourth smallest at second-to-last index
   * - And so on, alternating between left and right sides
   */
  public pyramid(): void {
    // Create a sorted copy of the values
    const sortedValues = [...this.values].sort((a, b) => a - b);
    const result = new Array(this.elementCount);

    let left = 0;
    let right = this.elementCount - 1;

    for (let i = 0; i < sortedValues.length; i++) {
      if (i % 2 === 0) {
        // Even indices go to the left side (0, 2, 4, ...)
        result[left] = sortedValues[i];
        left++;
      } else {
        // Odd indices go to the right side (1, 3, 5, ...)
        result[right] = sortedValues[i];
        right--;
      }
    }

    this.setValues(result);
  }

  private *setQuicksortColors(
    low: number,
    high: number,
    pivotIdx: number,
    activeIdx: number | null,
    lessThanPivotEnd: number,
    duration: number,
  ): ThreadGenerator {
    yield* all(
      ...this.rectangles.map((ref, idx) => {
        let targetColor = this.colors.default;
        let targetOpacity = 1;

        // Check if outside current partition
        if (idx < low || idx > high) {
          targetOpacity = 0.25;
          if (this.sortedIndices.has(idx)) {
            targetColor = this.colors.sorted;
          }
        }
        // Within current partition
        else {
          if (this.sortedIndices.has(idx)) {
            targetColor = this.colors.sorted;
          } else if (idx === pivotIdx) {
            targetColor = this.colors.pivot;
          } else if (activeIdx !== null && idx === activeIdx) {
            targetColor = this.colors.active;
          } else if (lessThanPivotEnd >= 0 && idx >= low && idx <= lessThanPivotEnd) {
            targetColor = this.colors.lessThanPivot;
          }
        }

        return all(
          ref().fill(targetColor, duration),
          ref().opacity(targetOpacity, duration),
        );
      }),
    );
  }

  private *swapElements(i: number, j: number, duration: number): ThreadGenerator {
    const rectI = this.rectangles[i]();
    const rectJ = this.rectangles[j]();

    // Store original heights before swapping values
    const heightI = this.values[i] * this.height();
    const heightJ = this.values[j] * this.height();

    // Set original rectangles to low opacity
    yield* all(rectI.opacity(0.0, 0), rectJ.opacity(0.0, 0));

    // Create clones at the same positions with the same properties
    const cloneI = createRef<Rect>();
    const cloneJ = createRef<Rect>();

    rectI
      .parent()
      .parent()
      .add(
        <Rect
          ref={cloneI}
          width={rectI.width()}
          height={heightI}
          fill={rectI.fill()}
          stroke={rectI.stroke()}
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
          width={rectJ.width()}
          height={heightJ}
          fill={rectJ.fill()}
          stroke={rectJ.stroke()}
          opacity={1}
          zIndex={10}
        />,
      );

    // Set absolute positions for clones
    cloneI().absolutePosition(rectI.absolutePosition());
    cloneJ().absolutePosition(rectJ.absolutePosition());

    // Get the bottom positions of the rectangles
    const bottomI = rectI.bottom();
    const bottomJ = rectJ.bottom();

    // Animate clones swapping positions (move to each other's bottom position)
    yield* all(cloneI().bottom(bottomJ, duration), cloneJ().bottom(bottomI, duration));

    // Swap in values array
    [this.values[i], this.values[j]] = [this.values[j], this.values[i]];

    // Store the colors before updating
    const colorI = rectI.fill();
    const colorJ = rectJ.fill();

    // Update original rectangles' heights and colors instantly to swapped values and restore opacity
    yield* all(
      rectI.height(this.values[i] * this.height(), 0),
      rectJ.height(this.values[j] * this.height(), 0),
      rectI.fill(colorJ, 0),
      rectJ.fill(colorI, 0),
      rectI.opacity(1, 0),
      rectJ.opacity(1, 0),
    );

    // Remove clones
    cloneI().remove();
    cloneJ().remove();
  }

  private *setPivotLine(
    show: boolean,
    pivotHeight: number,
    low: number,
    high: number,
  ): ThreadGenerator {
    if (show) {
      const rectWidth = this.rectangles[0]().width();
      const startX = this.rectangles[low]().x() - rectWidth / 2;
      const endX = this.rectangles[high]().x() + rectWidth / 2;
      const width = endX - startX;
      const centerX = (startX + endX) / 2;

      this.pivotLine().height(pivotHeight * this.elementsLayout().height());
      this.pivotLine().width(width);
      this.pivotLine().x(centerX);
      this.pivotLine().y(
        this.elementsLayout().y() +
          this.elementsLayout().height() / 2 -
          (pivotHeight * this.elementsLayout().height()) / 2,
      );

      yield* this.pivotLine().opacity(0.2, this.animationSpeed);
    } else {
      yield* this.pivotLine().opacity(0, this.animationSpeed);
    }
  }

  /**
   * Select pivot using median of three strategy
   * Returns the index of the median element among first, middle, and last
   */
  private getMedianOfThree(low: number, high: number): number {
    const mid = Math.floor((low + high) / 2);

    const first = this.values[low];
    const middle = this.values[mid];
    const last = this.values[high];

    // Count comparisons for mo3 (we need at most 3 comparisons to find median)
    this.comparisonCount += 3;

    // Find the median value and return its index
    // If middle value is between first and last (in either order), it's the median
    if ((first <= middle && middle <= last) || (last <= middle && middle <= first)) {
      return mid;
    }
    // If first value is between middle and last (in either order), it's the median
    else if ((middle <= first && first <= last) || (last <= first && first <= middle)) {
      return low;
    }
    // Otherwise, last value is the median
    else {
      return high;
    }
  }

  /**
   * Select a random pivot index between low and high (inclusive)
   */
  private getRandomPivot(low: number, high: number): number {
    return Math.floor(this.random.nextFloat() * (high - low + 1)) + low;
  }

  private *selectAndMovePivot(low: number, high: number): ThreadGenerator {
    if (this.pivotStrategy === 'mo3' && high - low >= 2) {
      // Use median of three for subarrays with at least 3 elements
      const mid = Math.floor((low + high) / 2);
      const medianIdx = this.getMedianOfThree(low, high);

      // Highlight the three elements being compared for median selection
      yield* all(
        this.rectangles[low]().fill(
          this.colors.active,
          this.animationSpeed * 0.5,
          easeInOutCubic,
          colorLerp,
        ),
        this.rectangles[mid]().fill(
          this.colors.active,
          this.animationSpeed * 0.5,
          easeInOutCubic,
          colorLerp,
        ),
        this.rectangles[high]().fill(
          this.colors.active,
          this.animationSpeed * 0.5,
          easeInOutCubic,
          colorLerp,
        ),
      );

      // Highlight the selected median element
      yield* this.rectangles[medianIdx]().fill(
        this.colors.pivot,
        this.animationSpeed * 0.3,
        easeInOutCubic,
        colorLerp,
      );

      // If median element is not already at the end, swap it there
      if (medianIdx !== high) {
        yield* this.swapElements(medianIdx, high, this.animationSpeed);
      }

      // Clear the selection highlighting (except for the pivot now at high)
      const indicesToClear = [low, mid];
      if (medianIdx !== high) {
        indicesToClear.push(medianIdx); // Clear the original position of median
      }

      yield* all(
        ...indicesToClear
          .filter((idx) => idx !== high)
          .map((idx) =>
            this.rectangles[idx]().fill(
              this.colors.default,
              this.animationSpeed * 0.3,
              easeInOutCubic,
              colorLerp,
            ),
          ),
      );
    } else if (this.pivotStrategy === 'random') {
      // Select a random pivot
      const randomIdx = this.getRandomPivot(low, high);

      // Highlight the randomly selected element
      yield* this.rectangles[randomIdx]().fill(
        this.colors.active,
        this.animationSpeed * 0.5,
        easeInOutCubic,
        colorLerp,
      );

      // Show it as the pivot
      yield* this.rectangles[randomIdx]().fill(
        this.colors.pivot,
        this.animationSpeed * 0.3,
        easeInOutCubic,
        colorLerp,
      );

      // If random element is not already at the end, swap it there
      if (randomIdx !== high) {
        yield* this.swapElements(randomIdx, high, this.animationSpeed);
      }

      // Clear the original position highlighting if we moved the element
      if (randomIdx !== high) {
        yield* this.rectangles[randomIdx]().fill(
          this.colors.default,
          this.animationSpeed * 0.3,
          easeInOutCubic,
          colorLerp,
        );
      }
    } else if (this.pivotStrategy === 'last') {
      // For 'last' strategy, pivot is already at position high, no action needed}
    } else if (this.pivotStrategy === 'first') {
      // For 'first' strategy, swap first element with last to make it pivot
      if (low !== high) {
        // Highlight the first element
        yield* this.rectangles[low]().fill(
          this.colors.active,
          this.animationSpeed * 0.5,
          easeInOutCubic,
          colorLerp,
        );

        // Show it as the pivot
        yield* this.rectangles[low]().fill(
          this.colors.pivot,
          this.animationSpeed * 0.3,
          easeInOutCubic,
          colorLerp,
        );

        // Swap it to the end position
        yield* this.swapElements(low, high, this.animationSpeed);

        // Clear the original position highlighting
        yield* this.rectangles[low]().fill(
          this.colors.default,
          this.animationSpeed * 0.3,
          easeInOutCubic,
          colorLerp,
        );
      }
    }
  }

  private *partition(
    low: number,
    high: number,
  ): Generator<ThreadGenerator, number, any> {
    // Select pivot and ensure it's at the end position (high)
    yield* this.selectAndMovePivot(low, high);

    // After selectAndMovePivot, pivot is always at index high
    const pivotIdx = high;
    const pivotValue = this.values[high];

    // Show pivot reference line and highlight pivot
    yield all(
      this.setPivotLine(true, pivotValue, low, high),
      this.setQuicksortColors(low, high, pivotIdx, null, -1, this.animationSpeed),
    );

    let i = low - 1;

    for (let j = low; j < high; j++) {
      yield* this.setQuicksortColors(low, high, pivotIdx, j, i, this.animationSpeed);

      this.comparisonCount++;

      if (this.values[j] < pivotValue) {
        i++;
        if (i !== j) {
          yield* this.swapElements(i, j, this.animationSpeed);
          yield* this.setQuicksortColors(
            low,
            high,
            pivotIdx,
            null,
            i,
            this.animationSpeed * 0.5,
          );
        }
      }
    }

    // Place pivot in correct position
    i++;
    if (i !== pivotIdx) {
      yield* this.swapElements(i, pivotIdx, this.animationSpeed);
    }

    // Mark pivot as sorted and hide pivot line
    this.sortedIndices.add(i);
    yield* all(
      this.setPivotLine(false, 0, low, high),
      this.setQuicksortColors(low, high, -1, null, -1, this.animationSpeed),
    );

    return i;
  }

  private *quicksort(low: number, high: number): ThreadGenerator {
    if (low < high) {
      yield* this.setQuicksortColors(
        low,
        high,
        -1,
        null,
        -1,
        this.animationSpeed * 0.5,
      );

      const pivotIdx = yield* this.partition(low, high);

      yield* this.quicksort(low, pivotIdx - 1);
      yield* this.quicksort(pivotIdx + 1, high);
    } else if (low === high) {
      this.sortedIndices.add(low);
      yield* this.setQuicksortColors(
        low,
        high,
        -1,
        null,
        -1,
        this.animationSpeed * 0.5,
      );
    }
  }
}
