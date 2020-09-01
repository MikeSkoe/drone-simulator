import P5 = require('p5');
import * as Matter from 'matter-js';
import { BodyID, Entity } from '../../types';

interface GroundState {
  body: Matter.Body;
}

export const Grounds = (
  p5: P5,
  data: [
    x: number,
    y: number,
    w: number,
    h: number,
  ][]
): Entity<GroundState>[] =>
  data
    .map(([x, y, w, h]) => {
      const body = Matter.Bodies.rectangle(x, y, w, h, { isStatic: true, id: BodyID.Ground });
      const state: GroundState = {
        body,
      };

      return {
        state,
        update: () => {},
        draw: () => {
          p5.push();
            p5.translate(body.position.x, body.position.y);
            p5.rotate(body.angle);
            p5.rect(-w/2, -h/2, w, h);
          p5.pop();
        },
      }
    });
