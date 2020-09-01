import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, BodyID } from '../../types';
import { $health } from '../../state';

interface CopterState {
  body: Matter.Body;
  nrg: number;
};

export const Copter = (
  p5: P5,
  [x, y]: [number, number] = [50, 50],
  [w, h]: [number, number] = [50, 25],
): Entity<CopterState> => {
  const body = Matter.Bodies.rectangle(
    x, y, w, h,
    { id: BodyID.Copter }
  );
  const state: CopterState = {
    body,
    nrg: 1,
  };

  $health.observable.subscribe(health => state.nrg = health);

  return {
    state,
    update: () => {
      const [gamepad] = navigator.getGamepads();
      const upValue = gamepad?.buttons[7].value ?? 0;
      const rotateValue = gamepad?.axes[0] ?? 0;
      const direction = p5.createVector(0, -(0.003 * upValue)).rotate(body.angle);

      // move
      if (state.nrg > 0) {
        Matter.Body.applyForce(
          body,
          body.position,
          direction,
        );
      }

      // rotate
      if (rotateValue !== 0) {
        Matter.Body.rotate(
          body,
          rotateValue / 8,
        );

        Matter.Body.setAngularVelocity(
          body,
          0,
        )
      }
      
      // decrease nrg
      if (upValue !== 0) {
        $health.next(
          health => Math.max(0, health - upValue / 1000),
        );
      }
    },
    draw: () => {
      p5.push();
        p5.translate(body.position.x, body.position.y);
        p5.rotate(body.angle);
        p5.rect(-w/2, -h/2, w, h);
      p5.pop();
    },
  }
}
