import P5 = require('p5');
import * as Matter from 'matter-js';
import { Key, Entity, BaseState, MyState } from '../../types';
import { addToWorld } from '../../hooks/addToWorld';

const imagePath = '/data/copter.png';

const MAX_MAGNITUDE = 5;
const WIDTH = 16;
const HEIGHT = 8 * .75;

export interface CopterState extends BaseState {
  power: number;
  setPos: (pos: [number, number]) => void;
  getPos: () => {x: number, y: number};
};

export const Copter = (
  p5: P5,
  state: MyState,
): Entity<CopterState> => {
  let imageData: P5.Image;
  const body = Matter.Bodies.rectangle(
    0, 0, WIDTH, HEIGHT,
    {
      label: 'copter',
      friction: 0.05,
    },
  );

  const localState: CopterState = {
    power: 0.00007,
    setPos: ([x, y]) => {
      Matter.Body.setPosition(
        body,
        Matter.Vector.create(x, y),
      );
    },
    getPos: () => body.position,
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
      // if (upValue !== 0) {
      //   state.health = Math.max(0, state.health - upValue / 1000);
      //   $nrg.next(() => state.health);
      // }
    },

    draw: () => {
      p5.push();
      {
        p5.translate(body.position.x, body.position.y);
        p5.rotate(body.angle);
        p5.image(imageData, -imageData.width/2, -imageData.height/2);
      }
      p5.pop();
    },
  }
};
