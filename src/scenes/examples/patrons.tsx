import {
  Circle,
  Gradient,
  Knot,
  Layout,
  Line,
  makeScene2D,
  Spline,
  Txt,
} from '@motion-canvas/2d';
import {
  all,
  Color,
  createRef,
  createSignal,
  linear,
  sequence,
  useLogger,
  useRandom,
  Vector2,
  waitFor,
} from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { appear } from '../../utilities/creation';
import { PolyTxt } from '../../utilities/text';
import patronsCsv from './patrons.csv?raw';

// Parse CSV handling quoted fields
function parseCSVRow(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

const patronRows = patronsCsv.split('\n').filter((l) => l.trim());
const patronNames = patronRows
  .slice(1)
  .map((row) => parseCSVRow(row))
  .filter((fields) => fields[3]?.trim() === 'Active patron')
  .map((fields) => fields[0]?.trim())
  .filter(Boolean)
  .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

export default makeScene2D(function* (view) {
  const random = useRandom();

  // Configuration
  const N = 92; // Number of circles
  const small_circle_size = 20;
  const large_circle_size = 40;
  const inner_scale = 0.4;
  const background = '#fdf6e3';
  const max_edge_distance = 220; // Maximum distance for edge visibility

  // Repulsion configuration
  const repulsion_strength = 400; // How strong the repulsion force is
  const repulsion_damping = 0.8; // Velocity damping factor
  const repulsion_range = 400; // Maximum distance at which repulsion is applied

  view.fill(background);

  // Screen bounds for positioning
  const screenBounds = {
    minX: -view.width() / 1.5,
    maxX: view.width() / 1.5,
    minY: -view.height() / 1.5,
    maxY: view.height() / 1.5,
  };

  // Random color generator
  const getRandomColor = () => {
    if (random.nextFloat(0, 1) < 0.65) {
      return new Color('#b58900').hex();
    } else {
      return new Color('#b58900').brighten(0.75).luminance(0.8).hex();
    }
  };

  const generateRandomCircleData = (count: number) => {
    const circles = [];
    const minDistance = 70; // Minimum distance between circle centers
    const maxAttempts = 30; // Maximum attempts to find a valid position for each circle

    // Helper function to check if a position is valid (not too close to existing circles)
    const isValidPosition = (
      newPos: Vector2,
      existingCircles: any[],
      minDist: number,
    ) => {
      return existingCircles.every((circle) => {
        const distance = Math.sqrt(
          Math.pow(newPos.x - circle.position.x, 2) +
            Math.pow(newPos.y - circle.position.y, 2),
        );
        return distance >= minDist;
      });
    };

    for (let i = 0; i < count; i++) {
      let position: Vector2 | null = null;
      let attempts = 0;

      // Try to find a valid position
      while (attempts < maxAttempts && !position) {
        const randomX =
          screenBounds.minX +
          random.nextFloat() * (screenBounds.maxX - screenBounds.minX);
        const randomY =
          screenBounds.minY +
          random.nextFloat() * (screenBounds.maxY - screenBounds.minY);
        const candidatePos = new Vector2(randomX, randomY);

        if (isValidPosition(candidatePos, circles, minDistance)) {
          position = candidatePos;
        }
        attempts++;
      }

      // If we couldn't find a valid position after maxAttempts, use a random position
      // This ensures we still generate the requested number of circles
      if (!position) {
        const randomX =
          screenBounds.minX +
          random.nextFloat() * (screenBounds.maxX - screenBounds.minX);
        const randomY =
          screenBounds.minY +
          random.nextFloat() * (screenBounds.maxY - screenBounds.minY);
        position = new Vector2(randomX, randomY);
      }

      // Random size (small or large)
      const size = random.nextFloat() > 0.66 ? large_circle_size : small_circle_size;

      // Random color
      const color = getRandomColor();

      circles.push({ position, size, color });
    }

    return circles;
  };

  // Helper function to generate random looped path with continuous tangents
  const generateRandomLoopedPath = (
    startPos: Vector2,
    numPoints: number = 5,
  ): { position: Vector2; startHandle?: Vector2; endHandle?: Vector2 }[] => {
    const knots: {
      position: Vector2;
      startHandle?: Vector2;
      endHandle?: Vector2;
    }[] = [];

    // Generate random intermediate points
    const positions: Vector2[] = [startPos];
    for (let i = 1; i < numPoints; i++) {
      const randomX =
        screenBounds.minX +
        random.nextFloat() * (screenBounds.maxX - screenBounds.minX);
      const randomY =
        screenBounds.minY +
        random.nextFloat() * (screenBounds.maxY - screenBounds.minY);
      positions.push(new Vector2(randomX, randomY));
    }

    // Create first knot with random end handle
    const firstHandleDirection = new Vector2(
      random.nextFloat(-1, 1),
      random.nextFloat(-1, 1),
    ).normalized.scale(random.nextFloat(50, 150));

    knots.push({
      position: positions[0],
      endHandle: firstHandleDirection,
    });

    // Create intermediate knots with random handles
    for (let i = 1; i < positions.length; i++) {
      const handleDirection = new Vector2(
        random.nextFloat(-1, 1),
        random.nextFloat(-1, 1),
      ).normalized.scale(random.nextFloat(50, 150));

      knots.push({
        position: positions[i],
        startHandle: handleDirection.scale(-1), // Incoming handle
        endHandle: handleDirection, // Outgoing handle
      });
    }

    // Create final knot that loops back to start
    // Its start handle should be opposite to the first knot's end handle for continuity
    knots.push({
      position: positions[0], // Same position as first knot
      startHandle: firstHandleDirection.scale(-1), // Opposite of first knot's end handle
    });

    return knots;
  };

  // Function to calculate repulsion force for a single circle
  const calculateRepulsionForce = (
    circleIndex: number,
    currentPositions: Vector2[],
  ): Vector2 => {
    const myPosition = currentPositions[circleIndex];
    let totalForce = new Vector2(0, 0);

    // Calculate repulsion from all other circles
    for (let i = 0; i < currentPositions.length; i++) {
      if (i === circleIndex) continue; // Skip self

      const otherPosition = currentPositions[i];
      const diff = myPosition.sub(otherPosition);
      const distance = Math.max(diff.magnitude, 1); // Prevent division by zero

      if (distance < repulsion_range) {
        // Only apply force if within range
        const force_magnitude = repulsion_strength / (distance * distance);
        const force_direction = diff.normalized;
        const force = force_direction.scale(force_magnitude);

        totalForce = totalForce.add(force);
      }
    }

    return totalForce;
  };

  // Generate random circle data
  const circleData = generateRandomCircleData(N);

  // Create refs and signals for each circle
  const splineRefs = circleData.map(() => createRef<Spline>());
  const circleRefs = circleData.map(() => createRef<Circle>());
  const progressSignals = circleData.map(() => createSignal(0));

  // Initialize physics state for each circle individually
  const circleVelocities = circleData.map(() => new Vector2(0, 0));
  const circleAdjustments = circleData.map(() => new Vector2(0, 0));

  // Create animated elements
  const animatedElements = circleData.map((data, i) => {
    const { position, size, color } = data;

    // Generate random looped path starting from this circle's position
    const pathKnots = generateRandomLoopedPath(position, 6);

    return {
      spline: (
        <Spline ref={splineRefs[i]} smoothness={1.0}>
          {pathKnots.map((knot, idx) => (
            <Knot
              key={`knot-${i}-${idx}`}
              position={knot.position}
              startHandle={knot.startHandle}
              endHandle={knot.endHandle}
            />
          ))}
        </Spline>
      ),
      circle: (
        <Circle
          key={`circle-${i}`}
          ref={circleRefs[i]}
          fill={color}
          width={size}
          height={size}
          position={() => {
            // Get base position from spline
            const percentage = progressSignals[i]();
            const basePos = splineRefs[i]().getPointAtPercentage(percentage).position;

            // Get all current base positions from splines
            const allBasePositions = splineRefs.map((splineRef, idx) => {
              return splineRef()
                .getPointAtPercentage(progressSignals[idx]())
                .position.add(circleAdjustments[idx]);
            });

            // Calculate repulsion force for this specific circle
            const repulsionForce = calculateRepulsionForce(i, allBasePositions);

            // Update this circle's velocity
            circleVelocities[i] = circleVelocities[i]
              .add(repulsionForce)
              .scale(repulsion_damping);

            // Update this circle's adjustment
            circleAdjustments[i] = circleAdjustments[i].add(circleVelocities[i]);

            // Keep the adjustment within reasonable bounds to prevent drift
            const maxAdjustment = 150;
            if (circleAdjustments[i].magnitude > maxAdjustment) {
              circleAdjustments[i] =
                circleAdjustments[i].normalized.scale(maxAdjustment);
            }

            // make sure that we end up at the start again
            let multiplicate = 1;
            if (percentage > 0.95) {
              multiplicate = 1 - (1 / (1 - 0.95)) * (percentage - 0.95);
            }

            // Calculate final position
            let finalPos = basePos.add(circleAdjustments[i].mul(multiplicate));
            return finalPos;
          }}
        >
          <Circle
            fill={background}
            width={size * inner_scale}
            height={size * inner_scale}
          />
        </Circle>
      ),
    };
  });

  // Create edges between all pairs of circles
  const edges = [];
  for (let i = 0; i < circleData.length; i++) {
    for (let j = i + 1; j < circleData.length; j++) {
      if (i > j) {
        continue;
      }

      const color1 = circleData[i].color;
      const color2 = circleData[j].color;

      if (random.nextFloat(0, 1) < 0.4) {
        continue;
      }

      edges.push(
        <Line
          key={`edge-${i}-${j}`}
          lineWidth={5}
          stroke={() => {
            const pos1 = circleRefs[i]().position();
            const pos2 = circleRefs[j]().position();
            return new Gradient({
              from: pos1,
              to: pos2,
              stops: [
                { offset: 0, color: color1 },
                { offset: 1, color: color2 },
              ],
            });
          }}
          points={() => [circleRefs[i]().position(), circleRefs[j]().position()]}
          opacity={() => {
            const pos1 = circleRefs[i]().position();
            const pos2 = circleRefs[j]().position();
            const distance = pos1.sub(pos2).magnitude;

            // Calculate opacity based on distance (closer = more opaque)
            const normalizedDistance = Math.pow(
              Math.min(distance / max_edge_distance, 1),
              3,
            );
            return Math.max(0, 1 - normalizedDistance);
          }}
        />,
      );
    }
  }

  // Add edges first (so they appear behind circles)
  edges.forEach((edge) => view.add(edge));

  // Add splines and circles
  animatedElements.forEach((element) => {
    view.add(element.spline);
    view.add(element.circle);
  });

  // --- Text overlay ---
  const titleRef = createRef<Txt>();
  const nameRefs = patronNames.map(() => createRef<Txt>());
  const midpoint = Math.ceil(patronNames.length / 2);
  const col1 = patronNames.slice(0, midpoint);
  const col2 = patronNames.slice(midpoint);

  view.add(
    <PolyTxt
      ref={titleRef}
      text="Thanks for watching!"
      fontWeight={700}
      fontSize={100}
      stroke={'#eee8d5aa'}
      lineWidth={12}
      strokeFirst={true}
      y={-300}
    />,
  );

  view.add(
    <Layout layout direction="row" gap={80} y={100}>
      <Layout layout direction="column" gap={10}>
        {col1.map((name, i) => (
          <PolyTxt
            ref={nameRefs[i]}
            text={name}
            fontWeight={500}
            fontSize={50}
            stroke={'#eee8d5aa'}
            strokeFirst={true}
            lineWidth={12}
            opacity={0}
          />
        ))}
      </Layout>
      <Layout layout direction="column" gap={10}>
        {col2.map((name, i) => (
          <PolyTxt
            ref={nameRefs[midpoint + i]}
            text={name}
            fontWeight={500}
            fontSize={50}
            stroke={'#eee8d5aa'}
            strokeFirst={true}
            lineWidth={12}
            opacity={0}
          />
        ))}
      </Layout>
    </Layout>,
  );

  const animationDuration = 90; // Same duration for all circles

  yield all(
    ...progressSignals.map((progress) => progress(1, animationDuration, linear)),
  );

  yield* all(
    titleRef().text('Thanks for watching!', 1),
    sequence(0.05, ...nameRefs.map((r) => r().opacity(1, 0.5))),
  );

  yield* waitFor(5);
});
