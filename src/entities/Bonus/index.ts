import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity } from '../../types';
import { $collisionActive, $health } from '../../state';
import { BodyID } from '../../types';

interface BonusState {
  body: Matter.Body;
}

export const Bonuses = (
  p5: P5,
  data: [
    x: number,
    y: number,
    r: number,
  ][],
): Entity<BonusState>[] => {
  $collisionActive.observable.subscribe(
    ([id1, id2]) => {
      if (
        id1 === BodyID.Bonus
        || id2 === BodyID.Bonus
      ) {
        $health.next(health => Math.min(1, health + 0.005));
      }
    }
  );

  return data.map(([x, y, r]) => {
    const body = Matter.Bodies.circle(
      x, y, r,
      {
        isStatic: true,
        isSensor: true,
        id: BodyID.Bonus,
      },
    );
    const state: BonusState = {
      body,
    };
  
    return {
      state,
      update: () => {},
      draw: () => {
        p5.circle(
          body.position.x,
          body.position.y,
          r * 2,
        );
      }
    }
  });
}
