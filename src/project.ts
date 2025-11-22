import { makeProject } from '@motion-canvas/core';

import equations from './scenes/examples/equations?scene';
import file_checking from './scenes/examples/file_checking?scene';
import motion_canvas from './scenes/examples/motion_canvas?scene';
import polylogo from './scenes/examples/polylogo?scene';
import table from './scenes/examples/quicksort/table?scene';
import title from './scenes/examples/title?scene';
import what_is_polylog from './scenes/examples/what_is_polylog?scene';
import youtube_videos from './scenes/examples/youtube_videos?scene';

import './global.css';

export default makeProject({
  experimentalFeatures: true,
  scenes: [
    title,
    what_is_polylog,
    motion_canvas,
    polylogo,
    youtube_videos,
    file_checking,
    equations,
    // table,
  ],
});
