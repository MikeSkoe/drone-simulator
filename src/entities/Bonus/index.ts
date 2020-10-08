import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, MyState, BaseState, BodyLabel } from '../../types';
import { $collisionActive } from '../../state';
import { addToWorld } from '../../hooks/addToWorld';

const RADIUS = 5;

export interface BonusState extends BaseState { }

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
        label: BodyLabel.Bonus,
      },
    ),
  );

  const localState: BonusState = {
    unsubs: [
      addToWorld(state.engine, bodies),

      $collisionActive.observable.subscribe(
        ([labelA, labelB]) => {
          if (
            labelA === BodyLabel.Bonus
            || labelB === BodyLabel.Bonus
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

