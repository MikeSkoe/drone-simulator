import * as Matter from 'matter-js';
import { $collisionStart, $collisionActive, $collisionEnd } from '../state';
import { BodyLabel } from '../types';

const onCollisionActive = (e: Matter.IEventCollision<Matter.Engine>) => {
  for (const pair of e.pairs) {
    const labelA = pair.bodyA.label;
    const labelB = pair.bodyB.label;

    $collisionActive.next(() => [
      BodyLabel[labelA],
      BodyLabel[labelB],
    ]);
  }
};

const onCollisionEnd = (e: Matter.IEventCollision<Matter.Engine>) => {
  for (const pair of e.pairs) {
    const labelA = pair.bodyA.label;
    const labelB = pair.bodyB.label;

    $collisionEnd.next(() => [
      BodyLabel[labelA],
      BodyLabel[labelB],
    ]);
  }
};

const onCollisionStart = (e: Matter.IEventCollision<Matter.Engine>) => {
  for (const pair of e.pairs) {
    const labelA = pair.bodyA.label;
    const labelB = pair.bodyB.label;

    $collisionStart.next(() => [
      BodyLabel[labelA],
      BodyLabel[labelB],
    ]);
  }
};

export const withCollision = (
  engine: Matter.Engine,
) => {
  Matter.Events.on(engine, 'collisionStart', onCollisionStart);
  Matter.Events.on(engine, 'collisionActive', onCollisionActive);
  Matter.Events.on(engine, 'collisionEnd', onCollisionEnd);

  return [
    () => {
      Matter.Events.off(engine, 'collisionStart', onCollisionStart);
      Matter.Events.off(engine, 'collisionActive', onCollisionActive);
      Matter.Events.off(engine, 'collisionEnd', onCollisionEnd);
    }
  ]
};

