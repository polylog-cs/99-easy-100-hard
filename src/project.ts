import { makeProject } from '@motion-canvas/core';

import table from './scenes/examples/quicksort/table?scene';

import './global.css';

export default makeProject({
  experimentalFeatures: true,
  scenes: [table],
});
