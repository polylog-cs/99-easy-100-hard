import { insert } from '@motion-canvas/2d';
import { Code } from '@motion-canvas/2d/lib/components';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { createRef } from '@motion-canvas/core';
import { waitFor } from '@motion-canvas/core/lib/flow';

// Custom components
import { ShikiHighlighter } from '../components/Shiki';
import { Solarized } from '../utilities/color';

// Code highlighter for JavaScript
const tsHighlighter = new ShikiHighlighter({
  highlighter: {
    lang: 'typescript',
    theme: 'solarized-light',
  },
});

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  let code = createRef<Code>();

  view.add(<Code highlighter={tsHighlighter} fontSize={32} ref={code} />);

  // Start with a basic function
  yield* code().code(
    `\
    import { insert } from '@motion-canvas/2d';
    import { Code } from '@motion-canvas/2d/lib/components';
    import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
    import { createRef } from '@motion-canvas/core';
    import { waitFor } from '@motion-canvas/core/lib/flow';

    // Custom components
    import { ShikiHighlighter } from '../components/Shiki';
    import { Solarized } from '../utilities/color';

    // Code highlighter for JavaScript
    const jsHighlighter = new ShikiHighlighter({
      highlighter: {
        lang: 'typescript',
        theme: 'solarized-light',
      },
    });
}`,
    1,
  );

  yield* waitFor(0.5);

  yield* code()
    .code(
      `\
function greet() {
  console.log("Hello!");
}`,
      1,
    )
    .wait(1);

  yield* waitFor(0.5);

  // Add a parameter
  yield* code().code(
    `\
function greet(name) {
  console.log("Hello!");
}`,
    1,
  );

  yield* waitFor(0.5);

  // Use the parameter in the greeting
  yield* code().code.edit(1)`\
function greet(name) {
  console.log("Hello${insert(', " + name + "')}!");
}`;

  yield* waitFor(0.5);

  // Add a default parameter
  yield* code().code.edit(1)`\
function greet(name${insert(' = "World"')}) {
  console.log("Hello, " + name + "!");
}`;

  yield* waitFor(0.5);

  // Add function calls
  yield* code().code.edit(1)`\
function greet(name = "World") {
  console.log("Hello, " + name + "!");
}${insert(`

greet();
greet("Alice");
greet("Bob");`)}`;

  yield* waitFor(0.5);

  yield* code().code.edit(1)`\
function greet(name = "World") {${insert(`
  if (typeof name !== 'string') {
    throw new Error('Name must be a string');
  }`)}
  console.log("Hello, " + name + "!");
}

greet();
greet("Alice");
greet("Bob");`;

  yield* waitFor(0.5);

  yield* code().code.edit(1)`\
${insert(`/**
 * Greets a person by name
 * @param {string} name - The name to greet
 * @throws {Error} If name is not a string
 */
`)}function greet(name = "World") {
  if (typeof name !== 'string') {
    throw new Error('Name must be a string');
  }
  console.log("Hello, " + name + "!");
}

greet();
greet("Alice");
greet("Bob");`;

  yield* waitFor(0.5);

  yield* code().code.edit(1)`\
/**
 * Greets a person by name
 * @param {string} name - The name to greet
 * @throws {Error} If name is not a string
 */
function greet(name = "World") {
  if (typeof name !== 'string') {
    throw new Error('Name must be a string');
  }
  console.log("Hello, " + name + "!");
}

greet();
greet("Alice");
greet("Bob");

${insert(`
// Error handling example
try {
  greet(123);
} catch (error) {
  console.error(error.message);
}`)}`;

  yield* waitFor(2);

  // Fade out
  yield* code().opacity(0, 1);
});
