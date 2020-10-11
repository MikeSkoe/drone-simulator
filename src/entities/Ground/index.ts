import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, BaseState, MyState } from '../../types';
import { addToWorld } from '../../hooks/addToWorld';

export interface GroundState extends BaseState { }

export const Grounds = (
  p5: P5,
  state: MyState,
  data: [
    x: number,
    y: number,
    w: number,
    h: number,
  ][]
): Entity<GroundState> =>{
  const bodies = data.map(([x, y, w, h]) =>
    Matter.Bodies.rectangle(
      (x + w/2),
      (y + h/2),
      w,
      h,
      {
        isStatic: true,
      }),
  );

  const localState: BaseState = {
    unsubs: [
      addToWorld(state.engine, bodies),
    ],
  };

  return {
    localState,
    update: () => {},
    draw: () => {},
  };
};

