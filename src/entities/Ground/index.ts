import P5 = require('p5');
import * as Matter from 'matter-js';
import { BodyID, Entity, BaseState, MyState } from '../../types';
import { addToWorld } from '../../hooks/addToWorld';

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
  const bodies = data.map(([x, y, w, h]) =>
    Matter.Bodies.rectangle(x, y, w, h, { isStatic: true, id: BodyID.Ground }),
  );

  const localState: BaseState = {
    unsubs: [
      addToWorld(state.engine, bodies),
    ],
  };

  return {
    localState,
    update: () => {
    },
    draw: () => {
      bodies.forEach(body => {
        const {x, y} = body.position;
        const {min, max} = body.bounds;
        const [w, h] = [max.x - min.x, max.y - min.y];

        p5.push();
          p5.translate(x, y);
          p5.rect(-w/2, -h/2, w, h);
        p5.pop();
      });
    },
  };
};

