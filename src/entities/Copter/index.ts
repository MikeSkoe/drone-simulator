import P5 = require('p5');
import * as Matter from 'matter-js';
import { Key, Entity, BaseState, MyState } from '../../types';
import { addToWorld } from '../../hooks/addToWorld';

const imagePath = '/data/copter.png';

const MAX_MAGNITUDE = 5;

export interface CopterState extends BaseState {
  pos: {x: number, y: number};
  power: number;
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
      label: 'copter',
      friction: 0.05,
    },
  );

  const localState: CopterState = {
    power: 0.00007,
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
      const upValue
        = p5.keyIsDown(Key.Up)
          ? 1
        : gamepad?.buttons[7].value ?? 0;
      const rotateValue
        = p5.keyIsDown(Key.Left)
          ? -1
        : p5.keyIsDown(Key.Right)
          ? 1
        : gamepad?.axes[0] ?? 0;
      const direction = p5
        .createVector(0, -(localState.power * upValue))
        .rotate(body.angle);

      // move
      if (state.health > 0) {
        // body.force = direction;
        Matter.Body.applyForce(
          body,
          body.position,
          direction,
        );
      }

      // set max velocity
      if (Matter.Vector.magnitude(body.velocity) > MAX_MAGNITUDE) {
        Matter.Body.setVelocity(
          body,
          body.velocity = Matter.Vector.mult(
            Matter.Vector.normalise(body.velocity),
            MAX_MAGNITUDE,
          ),
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
        // state.health = Math.max(0, state.health - upValue / 1000);
        
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

