import { makeProject } from '@motion-canvas/core';

import animations_in_videos from './scenes/examples/animations_in_videos?scene';
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
import basic_mo3 from './scenes/examples/quicksort/basic_mo3?scene';
import quicksort_many from './scenes/examples/quicksort/quicksort_many?scene';
import quicksort_part_1 from './scenes/examples/quicksort/quicksort_part_1?scene';
import table from './scenes/examples/quicksort/table?scene';
import rock_paper_scissors from './scenes/examples/rock_paper_scissors?scene';
import thank_you from './scenes/examples/thank_you?scene';
import title from './scenes/examples/title?scene';
import what_is_polylog from './scenes/examples/what_is_polylog?scene';
import youtube_videos from './scenes/examples/youtube_videos?scene';

import './global.css';

export default makeProject({
  experimentalFeatures: true,
  scenes: [
    title,
    what_is_polylog,
    youtube_videos,
    animations_in_videos,
    motion_canvas,
    code_1,
    code_2,
    code_3,
    code_4,
    code_5_wave,
    code_6_blender,
    file_checking,
    equations,
    quicksort_part_1,
    quicksort_many,
    rock_paper_scissors,
    // table,
    thank_you,
  ],
});
