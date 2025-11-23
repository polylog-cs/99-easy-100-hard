import { makeProject } from '@motion-canvas/core';

import code_1 from './scenes/examples/code_1?scene';
import code_2 from './scenes/examples/code_2?scene';
import code_3 from './scenes/examples/code_3?scene';
import code_4 from './scenes/examples/code_4?scene';
import code_5_wave from './scenes/examples/code_5_wave?scene';
import code_6_blender from './scenes/examples/code_6_blender?scene';
import equations from './scenes/examples/equations?scene';
import file_checking from './scenes/examples/file_checking?scene';
import motion_canvas from './scenes/examples/motion_canvas?scene';
import phone from './scenes/examples/phone?scene';
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
    code_1,
    code_2,
    code_3,
    code_4,
    code_5_wave,
    code_6_blender,
    youtube_videos,
    file_checking,
    equations,
    // table,
  ],
});
