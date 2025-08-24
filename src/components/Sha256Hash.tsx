import { Layout, LayoutProps, Node, NodeProps, TxtProps } from '@motion-canvas/2d';
import {
  Color,
  createRef,
  linear,
  ThreadGenerator,
  useRandom,
  Vector2,
} from '@motion-canvas/core';

import { Solarized } from '../utilities/color';
import { instantTextLerp, PolyTxt } from '../utilities/text';

export interface Sha256HashProps extends LayoutProps {
  shaProps?: Partial<TxtProps>;
  hashProps?: Partial<TxtProps>;
}

export class Sha256Hash extends Layout {
  private readonly sha = createRef<PolyTxt>();
  private readonly hash = createRef<PolyTxt>();

  public constructor(props: Sha256HashProps = {}) {
    const { shaProps = {}, hashProps = {}, ...layoutProps } = props;

    super({
      layout: true,
      direction: 'column',
      alignItems: 'center',
      gap: 20,
      zIndex: -1,
      ...layoutProps,
    });

    this.add(
      <>
        <PolyTxt
          text={'sha256'}
          fontFamily={'monospace'}
          fontSize={60}
          fontWeight={700}
          fill={Solarized.cyan}
          ref={this.sha}
          {...shaProps}
        />
        <PolyTxt
          text={
            '0000000000000000\n0000000000000000\n0000000000000000\n0000000000000000'
          }
          fontFamily={'monospace'}
          fontSize={40}
          {...hashProps}
          ref={this.hash}
        />
      </>,
    );
  }

  private randomSha256Hash(): string {
    const random = useRandom();
    let hashValue = '';

    // Generate 4 rows of 16 hex characters each
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 16; col++) {
        // Generate random number between 0-255, then convert to hex
        const randomByte = random.nextInt(0, 255);
        const hexChar = randomByte.toString(16).padStart(2, '0');
        // Take only the first hex digit for the hash display
        hashValue += hexChar.charAt(0);
      }
      // Add newline after each row except the last
      if (row < 3) {
        hashValue += '\n';
      }
    }

    return hashValue;
  }

  public *iterate(
    iterations: number = 38,
    duration: number = 0.05,
    finalHash?: string,
  ): ThreadGenerator {
    for (let i = 0; i < iterations; i++) {
      // Use final hash on the last iteration if provided
      const hashToShow =
        i === iterations - 1 && finalHash ? finalHash : this.randomSha256Hash();
      yield* this.hash().text(hashToShow, duration, linear, instantTextLerp);
    }
  }

  public getSha() {
    return this.sha();
  }

  public getHashText() {
    return this.hash().text();
  }
}
