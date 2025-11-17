import { makeProject } from '@motion-canvas/core';

import equations from './scenes/examples/equations?scene';
import file_checking from './scenes/examples/file_checking?scene';
import table from './scenes/examples/quicksort/table?scene';

import './global.css';

export default makeProject({
  experimentalFeatures: true,
  scenes: [file_checking],
});
