import { makeProject } from '@motion-canvas/core';

import a99_vs_100 from './scenes/examples/99_vs_100?scene';
import bobby_tables from './scenes/examples/bobby_tables?scene';
import comparison_table from './scenes/examples/comparison_table?scene';
import conclusion from './scenes/examples/conclusion?scene';
import equations from './scenes/examples/equations?scene';
import file_checking from './scenes/examples/file_checking?scene';
import outro from './scenes/examples/outro?scene';
import quicksort_part_1 from './scenes/examples/quicksort/quicksort_part_1?scene';
import sorted_with_last_and_random_comparison from './scenes/examples/quicksort/sorted_with_last_and_random_comparison?scene';
import worst_to_average from './scenes/examples/quicksort/worst_to_average?scene';
import randomness_plus_worst_case from './scenes/examples/randomness_plus_worst_case?scene';
import rock_paper_scissors from './scenes/examples/rock_paper_scissors?scene';
import subscribe from './scenes/examples/subscribe?scene';

import './global.css';

export default makeProject({
  experimentalFeatures: true,
  scenes: [
    file_checking,
    equations,
    comparison_table,
    quicksort_part_1,
    sorted_with_last_and_random_comparison,
    bobby_tables,
    worst_to_average,
    rock_paper_scissors,
  ],
});
