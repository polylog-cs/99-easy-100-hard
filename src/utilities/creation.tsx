import { Layout } from '@motion-canvas/2d';
import { all, Reference, ThreadGenerator } from '@motion-canvas/core';

export function* appear(object: Reference<Layout>): ThreadGenerator {
  yield* all(object().opacity(0).opacity(1, 1), object().scale(0).scale(1, 1));
}
