import { Layout, Node, View2D } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  Reference,
  ThreadGenerator,
  useLogger,
  useRandom,
  Vector2,
} from '@motion-canvas/core';

import { Solarized } from './color';
import { PolyTxt } from './text';

/**
 * Presentation utilities for creating standardized slide elements
 */

export interface SectionHeaderConfig {
  text: string;
  fontSize?: number;
  position?: [number, number];
}

export interface TwoLineSectionHeaderConfig {
  text1: string;
  text2: string;
  fontSize1?: number;
  fontSize2?: number;
  position1?: [number, number];
  position2?: [number, number];
  text2Fill?: string;
}

export interface TwoLineHeaderElements {
  title1: Reference<PolyTxt>;
  title2: Reference<PolyTxt>;
}

export interface SlideWithHeaderConfig {
  headerText: string;
  headerFontSize?: number;
  headerPosition?: [number, number];
  contentPosition?: [number, number];
  contentGap?: number;
}

export interface SlideElements {
  header: Reference<PolyTxt>;
  contentLayout: Reference<Layout>;
  bulletRefs: Reference<PolyTxt>[];
}

export function* beginAnnonymousSlide() {
  let random = useRandom();

  let hex = [];

  for (let i = 0; i < 3; i++) {
    hex.push(random.nextInt(0, 255).toString(16).padStart(2, '0'));
  }

  yield* beginSlide(hex.join(''));
}

/**
 * Creates a standardized centered header for subsections (full screen)
 * @param view - The scene view to add the header to
 * @param titleRef - Reference to the title text component
 * @param config - Configuration for the header
 * @returns The created PolyTxt node
 */
export function createSectionHeader(
  view: View2D,
  titleRef: Reference<PolyTxt>,
  config: SectionHeaderConfig,
): Node {
  const { text, fontSize = 120, position = [0, 0] } = config;

  view.fill(Solarized.background);

  const header = (
    <PolyTxt
      ref={titleRef}
      text={text}
      fontSize={fontSize}
      position={position}
      opacity={0}
    />
  );

  view.add(header);

  return header;
}

/**
 * Creates a two-line section header (full screen)
 * @param view - The scene view to add the header to
 * @param config - Configuration for the two-line header
 * @returns References to both title text components
 */
export function createTwoLineSectionHeader(
  view: View2D,
  config: TwoLineSectionHeaderConfig,
): TwoLineHeaderElements {
  const {
    text1,
    text2,
    fontSize1 = 100,
    fontSize2 = 80,
    position1 = [0, -50],
    position2 = [0, 70],
    text2Fill = Solarized.base1,
  } = config;

  view.fill(Solarized.background);

  const title1Ref = createRef<PolyTxt>();
  const title2Ref = createRef<PolyTxt>();

  view.add(
    <>
      <PolyTxt
        ref={title1Ref}
        text={text1}
        fontSize={fontSize1}
        position={position1}
        opacity={0}
      />
      <PolyTxt
        ref={title2Ref}
        text={text2}
        fontSize={fontSize2}
        fill={text2Fill}
        position={position2}
        opacity={0}
      />
    </>,
  );

  return {
    title1: title1Ref,
    title2: title2Ref,
  };
}

/**
 * Creates a slide with a header at the top and a content area for bullet points
 * @param view - The scene view to add elements to
 * @param config - Configuration for the slide
 * @param bulletPoints - Array of bullet point strings
 * @returns References to the header, content layout, and bullet point elements
 */
export function createSlideWithHeader(
  view: View2D,
  config: SlideWithHeaderConfig,
  bulletPoints: string[],
): SlideElements {
  const { headerText, headerFontSize = 80, contentGap = 20 } = config;

  view.fill(Solarized.background);

  const headerRef = createRef<PolyTxt>();
  const contentLayoutRef = createRef<Layout>();
  const bulletRefs: Reference<PolyTxt>[] = [];

  // Create refs for each bullet point
  for (let i = 0; i < bulletPoints.length; i++) {
    bulletRefs.push(createRef<PolyTxt>());
  }

  view.add(
    <>
      <PolyTxt
        ref={headerRef}
        text={headerText}
        fontSize={headerFontSize}
        topLeft={() => new Vector2(-800, -330)}
        opacity={0}
      />
      <Layout
        ref={contentLayoutRef}
        layout
        direction={'column'}
        gap={contentGap}
        topLeft={() => new Vector2(-750, -150)}
      >
        {bulletPoints.map((point, index) => (
          <PolyTxt ref={bulletRefs[index]} text={point} opacity={0} fontSize={50} />
        ))}
      </Layout>
    </>,
  );

  return {
    header: headerRef,
    contentLayout: contentLayoutRef,
    bulletRefs,
  };
}

/**
 * Animates a header text appearing
 * @param titleRef - Reference to the title text component
 * @param text - The text to display
 * @param duration - Animation duration in seconds
 */
export function* showHeader(
  titleRef: Reference<PolyTxt>,
  duration: number = 1,
): ThreadGenerator {
  const text = titleRef().text();

  yield* all(
    titleRef().text('').text(text, duration),
    titleRef().opacity(0).opacity(1, 0.1),
  );
}

/**
 * Animates bullet points appearing one by one with slide breaks between each
 * @param bulletRefs - Array of references to bullet point text components
 * @param bulletTexts - Array of bullet point strings
 * @param slidePrefix - Prefix for slide break names (e.g., 'bullet' creates 'bullet-0', 'bullet-1', etc.)
 * @param duration - Animation duration for each bullet in seconds
 */
export function* animateBullets(
  bulletRefs: Reference<PolyTxt>[],
  duration: number = 0.5,
): ThreadGenerator {
  for (let i = 0; i < bulletRefs.length; i++) {
    yield* beginAnnonymousSlide();
    yield* showHeader(bulletRefs[i]);
  }
}
