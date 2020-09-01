import * as Matter from 'matter-js';
import { $collisionStart, $collisionActive } from '../state';

export const collisionChecking = (
  engine: Matter.Engine,
) => {
  Matter.Events.on(
    engine,
    'collisionActive',
    e => {
      for (const pair of e.pairs) {
        const a = pair.bodyA;
        const b = pair.bodyB;

        $collisionActive.next(() => [a.id, b.id]);
      }
    },
  );

  Matter.Events.on(
    engine,
    'collisionStart',
    e => {
      for (const pair of e.pairs) {
        const a = pair.bodyA;
        const b = pair.bodyB;

        $collisionStart.next(() => [a.id, b.id]);
      }
    }
  )
};

