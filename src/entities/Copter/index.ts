import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, BodyID, BaseState, MyState } from '../../types';

interface CopterState extends BaseState { };

export const Copter = (
  p5: P5,
  state: MyState,
  [x, y]: [number, number] = [50, 50],
  [w, h]: [number, number] = [50, 25],
): Entity<CopterState> => {
  const localState: CopterState = {
    bodies: [
      Matter.Bodies.rectangle(
        x, y, w, h,
        { id: BodyID.Copter }
      ),
    ],
    unsubs: [],
  };

  return {
    localState,
    update: () => {
      if (!state.movable) {
        return;
      }

      const [gamepad] = navigator.getGamepads();
      const upValue = gamepad?.buttons[7].value ?? 0;
      const rotateValue = gamepad?.axes[0] ?? 0;
      const [body] = localState.bodies;
      const direction = p5
        .createVector(0, -(0.003 * upValue))
        .rotate(body.angle);

      // move
      if (state.health > 0) {
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
        state.health = Math.max(0, state.health - upValue / 1000);
      }
    },

    draw: () => {
      p5.push();
      {
        localState.bodies.forEach(body => {
          p5.translate(body.position.x, body.position.y);
          p5.rotate(body.angle);
          p5.rect(-w/2, -h/2, w, h);
        });
      }
      p5.pop();
    },
  }
};

