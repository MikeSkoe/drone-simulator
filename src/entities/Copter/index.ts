import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, BodyID, BaseState, MyState } from '../../types';
import { addToWorld } from '../../hooks/addToWorld';
// @ts-ignore
import imagePath from '../../data/copter.png';

export interface CopterState extends BaseState {
  pos: {x: number, y: number};
};

export const Copter = (
  p5: P5,
  state: MyState,
  [x, y]: [number, number] = [50, 50],
  [w, h]: [number, number] = [50, 25],
): Entity<CopterState> => {
  let imageData: P5.Image;
  const body = Matter.Bodies.rectangle(
    x + w/2, y + h/2, w, h,
    {
      id: BodyID.Copter,
      label: 'copter',
    },
  );
  console.log(body);

  const localState: CopterState = {
    pos: body.position,
    unsubs: [
      addToWorld(state.engine, [body]),
    ],
  };

  return {
    localState,
    preload: () => {
      imageData = p5.loadImage(imagePath);
    },
    update: () => {
      if (!state.movable) {
        return;
      }

      localState.pos = body.position;

      const [gamepad] = navigator.getGamepads();
      const upValue = gamepad?.buttons[7].value ?? 0;
      const rotateValue = gamepad?.axes[0] ?? 0;
      const direction = p5
        .createVector(0, -(0.0002 * upValue))
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
        p5.translate(body.position.x, body.position.y);
        p5.rotate(body.angle);
        p5.image(imageData, -w/2, -h/4);
      }
      p5.pop();
    },
  }
};

