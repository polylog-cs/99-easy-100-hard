import { Circle, Layout, Node, View2D } from '@motion-canvas/2d';
import {
  all,
  beginSlide,
  createRef,
  linear,
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
  circBulletRefs: Reference<Circle>[];
}

export interface TwoColumnSlideConfig {
  headerText: string;
  headerFontSize?: number;
  headerPosition?: [number, number];
  columnGap?: number;
  contentGap?: number;
  bulletFontSize?: number;
  columnHeaderFontSize?: number;
}

export interface TwoColumnSlideElements {
  header: Reference<PolyTxt>;
  leftColumnHeader: Reference<PolyTxt>;
  leftBulletRefs: Reference<PolyTxt>[];
  leftCircBulletRefs: Reference<Circle>[];
  rightColumnHeader: Reference<PolyTxt>;
  rightBulletRefs: Reference<PolyTxt>[];
  rightCircBulletRefs: Reference<Circle>[];
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
  const circBulletRefs: Reference<Circle>[] = [];

  // Create refs for each bullet point
  for (let i = 0; i < bulletPoints.length; i++) {
    bulletRefs.push(createRef<PolyTxt>());
    circBulletRefs.push(createRef<Circle>());
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
          <Layout>
            <Circle
              ref={circBulletRefs[index]}
              width={15}
              height={15}
              margin={20}
              fill={Solarized.text}
              opacity={0}
              topLeft={() => new Vector2(-750, -150)}
            />
            <PolyTxt ref={bulletRefs[index]} text={point} opacity={0} fontSize={50} />
          </Layout>
        ))}
      </Layout>
    </>,
  );

  return {
    header: headerRef,
    contentLayout: contentLayoutRef,
    bulletRefs,
    circBulletRefs,
  };
}

/**
 * Creates a slide with a header and two columns of bullet points
 * @param view - The scene view to add elements to
 * @param config - Configuration for the slide
 * @param leftColumnHeader - Header text for left column
 * @param leftBulletPoints - Array of bullet point strings for left column
 * @param rightColumnHeader - Header text for right column
 * @param rightBulletPoints - Array of bullet point strings for right column
 * @returns References to the header and bullet point elements for both columns
 */
export function createTwoColumnSlideWithHeader(
  view: View2D,
  config: TwoColumnSlideConfig,
  leftColumnHeader: string,
  leftBulletPoints: string[],
  rightColumnHeader: string,
  rightBulletPoints: string[],
): TwoColumnSlideElements {
  const {
    headerText,
    headerFontSize = 80,
    columnGap = 100,
    contentGap = 20,
    bulletFontSize = 50,
    columnHeaderFontSize = 60,
  } = config;

  view.fill(Solarized.background);

  const headerRef = createRef<PolyTxt>();
  const leftColumnHeaderRef = createRef<PolyTxt>();
  const rightColumnHeaderRef = createRef<PolyTxt>();
  const leftBulletRefs: Reference<PolyTxt>[] = [];
  const leftCircBulletRefs: Reference<Circle>[] = [];
  const rightBulletRefs: Reference<PolyTxt>[] = [];
  const rightCircBulletRefs: Reference<Circle>[] = [];

  // Create refs for left column bullets
  for (let i = 0; i < leftBulletPoints.length; i++) {
    leftBulletRefs.push(createRef<PolyTxt>());
    leftCircBulletRefs.push(createRef<Circle>());
  }

  // Create refs for right column bullets
  for (let i = 0; i < rightBulletPoints.length; i++) {
    rightBulletRefs.push(createRef<PolyTxt>());
    rightCircBulletRefs.push(createRef<Circle>());
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
        layout
        direction={'row'}
        gap={columnGap}
        topLeft={() => new Vector2(-750, -190)}
      >
        {/* Left Column */}
        <Layout layout direction={'column'} gap={contentGap}>
          <PolyTxt
            ref={leftColumnHeaderRef}
            text={leftColumnHeader}
            fontSize={columnHeaderFontSize}
            fontWeight={700}
            opacity={0}
            marginBottom={10}
          />
          {leftBulletPoints.map((point, index) => (
            <Layout>
              <Circle
                ref={leftCircBulletRefs[index]}
                width={15}
                height={15}
                margin={20}
                fill={Solarized.text}
                opacity={0}
              />
              <PolyTxt
                ref={leftBulletRefs[index]}
                text={point}
                opacity={0}
                fontSize={bulletFontSize}
              />
            </Layout>
          ))}
        </Layout>

        {/* Right Column */}
        <Layout layout direction={'column'} gap={contentGap}>
          <PolyTxt
            ref={rightColumnHeaderRef}
            text={rightColumnHeader}
            fontSize={columnHeaderFontSize}
            fontWeight={700}
            opacity={0}
            marginBottom={10}
          />
          {rightBulletPoints.map((point, index) => (
            <Layout>
              <Circle
                ref={rightCircBulletRefs[index]}
                width={15}
                height={15}
                margin={20}
                fill={Solarized.text}
                opacity={0}
              />
              <PolyTxt
                ref={rightBulletRefs[index]}
                text={point}
                opacity={0}
                fontSize={bulletFontSize}
              />
            </Layout>
          ))}
        </Layout>
      </Layout>
    </>,
  );

  return {
    header: headerRef,
    leftColumnHeader: leftColumnHeaderRef,
    leftBulletRefs,
    leftCircBulletRefs,
    rightColumnHeader: rightColumnHeaderRef,
    rightBulletRefs,
    rightCircBulletRefs,
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
  duration: number = 0.5,
): ThreadGenerator {
  const text = titleRef().text();

  yield* all(
    titleRef().text('').text(text, duration, linear),
    titleRef().opacity(0).opacity(1, duration),
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
  circBulletRefs: Reference<Circle>[],
  duration: number = 0.5,
): ThreadGenerator {
  for (let i = 0; i < bulletRefs.length; i++) {
    yield* beginAnnonymousSlide();
    yield* all(
      circBulletRefs[i]()
        .opacity(0)
        .opacity(1, duration / 2),
      showHeader(bulletRefs[i]),
    );
  }
}
