import { makeProject } from '@motion-canvas/core';

import basic from './scenes/basic?scene';
import code from './scenes/code?scene';
import text from './scenes/text?scene';

import './global.css';

export default makeProject({
  experimentalFeatures: true,
  scenes: [basic, text, code],
});
