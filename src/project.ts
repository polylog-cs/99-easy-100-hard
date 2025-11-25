import { makeProject } from '@motion-canvas/core';

import a99_vs_100 from './scenes/examples/99_vs_100?scene';
import animations_in_videos from './scenes/examples/animations_in_videos?scene';
import bobby_tables from './scenes/examples/bobby_tables?scene';
import code_1 from './scenes/examples/code_1?scene';
import code_2 from './scenes/examples/code_2?scene';
import code_3 from './scenes/examples/code_3?scene';
import code_4 from './scenes/examples/code_4?scene';
import code_5_wave from './scenes/examples/code_5_wave?scene';
import code_6_blender from './scenes/examples/code_6_blender?scene';
import equations from './scenes/examples/equations?scene';
import file_checking from './scenes/examples/file_checking?scene';
import how_to_make_youtube_videos from './scenes/examples/how_to_make_youtube_videos?scene';
import motion_canvas from './scenes/examples/motion_canvas?scene';
import phone from './scenes/examples/phone?scene';
import basic_mo3 from './scenes/examples/quicksort/basic_mo3?scene';
import quicksort_many from './scenes/examples/quicksort/quicksort_many?scene';
import quicksort_part_1 from './scenes/examples/quicksort/quicksort_part_1?scene';
import shuffled_vs_sorted_with_last_pivot from './scenes/examples/quicksort/shuffled_vs_sorted_with_last_pivot?scene';
import sorted_with_last_and_random_comparison from './scenes/examples/quicksort/sorted_with_last_and_random_comparison?scene';
import table from './scenes/examples/quicksort/table?scene';
import worst_to_average from './scenes/examples/quicksort/worst_to_average?scene';
import randomness_plus_worst_case from './scenes/examples/randomness_plus_worst_case?scene';
import rock_paper_scissors from './scenes/examples/rock_paper_scissors?scene';
import thank_you from './scenes/examples/thank_you?scene';
import title from './scenes/examples/title?scene';
import what_is_polylog from './scenes/examples/what_is_polylog?scene';
import why_are_you_not_making_videos from './scenes/examples/why_are_you_not_making_videos?scene';
import youtube_videos from './scenes/examples/youtube_videos?scene';

import './global.css';

export default makeProject({
  experimentalFeatures: true,
  scenes: [
    title,
    // === intro ===
    // TODO
    // what_is_polylog,
    // youtube_videos,
    // === easy hard ===
    file_checking,
    a99_vs_100,
    equations,
    quicksort_part_1,
    sorted_with_last_and_random_comparison,
    bobby_tables,
    worst_to_average,
    randomness_plus_worst_case,
    rock_paper_scissors,
    // === programming ===
    animations_in_videos,
    motion_canvas,
    code_1,
    code_2,
    code_3,
    code_4,
    code_5_wave,
    code_6_blender,
    // === motivation ===
    // TODO
    how_to_make_youtube_videos,
    why_are_you_not_making_videos,
    thank_you,
  ],
});
