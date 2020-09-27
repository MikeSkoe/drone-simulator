import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, MyState, BaseState } from '../../types';
import { $collisionActive } from '../../state';
import { BodyID } from '../../types';
import { addToWorld } from '../../hooks/addToWorld';

const RADIUS = 25;

interface BonusState extends BaseState { }

export const Bonuses = (
  p5: P5,
  state: MyState,
  data: [
    x: number,
    y: number,
  ][],
): Entity<BonusState> => {
  const bodies = data.map(([x, y]) => 
    Matter.Bodies.circle(
      x, y, RADIUS,
      {
        isStatic: true,
        isSensor: true,
        id: BodyID.Bonus,
      },
    ),
  );

  const localState: BonusState = {
    unsubs: [
      addToWorld(state.engine, bodies),

      $collisionActive.observable.subscribe(
        ([id1, id2]) => {
          if (
            id1 === BodyID.Bonus
            || id2 === BodyID.Bonus
          ) {
            state.health = Math.min(1, state.health + 0.005);
          }
        }
      ).unsubscribe,
    ],
  };

  return {
    localState,
    update: () => {},
    draw: () => {
      bodies.forEach(body => {
        p5.circle(
          body.position.x,
          body.position.y,
          RADIUS * 2,
        );
      });
    }
  };
};

