import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, BaseState, MyState, BodyLabel } from '../../types';
import { addToWorld } from '../../hooks/addToWorld';

export interface GroundState extends BaseState {
  addGround: (pos: [number, number], size: [number, number]) => void;
}

export const Grounds = (
  p5: P5,
  state: MyState,
): Entity<GroundState> =>{
  const unsubs: (() => void)[] = [];
  const bodies: Matter.Body[] = [];

  const localState: GroundState = {
    addGround: ([x, y], [w, h]) => {
      const body = Matter.Bodies.rectangle(
        (x + w/2), (y + h/2),
        w, h,
        { isStatic: true, label: BodyLabel.Ground }
      );

      bodies.push(body);
      unsubs.push(addToWorld(state.engine, [body]));
    },
    unsubs,
  };

  return {
    localState,
    update: () => {},
    draw: () => {},
  };
};

