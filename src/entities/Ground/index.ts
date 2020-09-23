import P5 = require('p5');
import * as Matter from 'matter-js';
import { BodyID, Entity, BaseState, MyState } from '../../types';

interface GroundState extends BaseState { }

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
  const localState: BaseState = {
    bodies: data.map(([x, y, w, h]) =>
      Matter.Bodies.rectangle(x, y, w, h, { isStatic: true, id: BodyID.Ground }),
    ),
    unsubs: [],
  };

  return {
    localState,
    update: () => {
    },
    draw: () => {
      data.forEach(([x, y, w, h]) => {
        p5.push();
          p5.translate(x, y);
          p5.rect(-w/2, -h/2, w, h);
        p5.pop();
      });
    },
  };
};

