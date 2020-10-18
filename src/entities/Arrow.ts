import * as Matter from 'matter-js';
import P5 = require('p5');
import { Entity, MyState, BaseState, SCALE } from '../types';

export interface ArrowState extends BaseState {
  getPositionA: () => ({x: number, y: number});
  getPositionB: () => ({x: number, y: number});
}

export const Arrow = (
  p5: P5,
  state: MyState,
): Entity<ArrowState> => {
  const localState: ArrowState = {
    unsubs: [],
    getPositionA: () => ({x: 0, y: 0}),
    getPositionB: () => ({x: 0, y: 0}),
  };

  return {
    localState,
    update: () => {
    },
    draw: () => {
      p5.push()
      {
        const posA = localState.getPositionA();
        const posB = localState.getPositionB();

        const angle = Matter.Vector.angle(posA, posB);
        const distance = Matter.Vector.magnitude(
          Matter.Vector.sub(posA, posB),
        );

        const {x, y} = localState.getPositionB();
        const offset = Matter.Vector.mult(
          Matter.Vector.rotate(
            Matter.Vector.create(1, 0),
            angle,
          ),
          p5.width * 0.48,
        )

        if (x !== 0 && y !== 0 && distance > 100) {
          p5.fill('red');
          p5.translate((p5.width/2 + offset.x) / SCALE, (p5.height/2 + offset.y) / SCALE);
          p5.angleMode('radians');
          p5.rotate(angle);
          p5.circle(0, 0, 5);
        }
      }
      p5.pop()
    },
  };
};

