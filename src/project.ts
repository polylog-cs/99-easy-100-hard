import { makeProject } from '@motion-canvas/core';

import basic from './scenes/basic?scene';
import code from './scenes/code?scene';
import equations from './scenes/examples/equations?scene';
import file_checking from './scenes/examples/file_checking?scene';
import text from './scenes/text?scene';

import './global.css';

export default makeProject({
  experimentalFeatures: true,
  scenes: [file_checking],
});
