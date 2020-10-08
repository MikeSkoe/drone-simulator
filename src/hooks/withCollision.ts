import * as Matter from 'matter-js';
import { $collisionStart, $collisionActive } from '../state';
import { BodyLabel } from '../types';

export const withCollision = (
  engine: Matter.Engine,
) => {
  Matter.Events.on(
    engine,
    'collisionActive',
    e => {
      for (const pair of e.pairs) {
        const labelA = pair.bodyA.label;
        const labelB = pair.bodyB.label;

        $collisionActive.next(() => [
          BodyLabel[labelA],
          BodyLabel[labelB],
        ]);
      }
    },
  );

  Matter.Events.on(
    engine,
    'collisionStart',
    e => {
      for (const pair of e.pairs) {
        const labelA = pair.bodyA.label;
        const labelB = pair.bodyB.label;

        $collisionStart.next(() => [
          BodyLabel[labelA],
          BodyLabel[labelB],
        ]);
      }
    }
  )
};

