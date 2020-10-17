import P5 = require('p5');
import { Entity, BaseState, MyState, SCALE } from '../../types';

export interface CameraState extends BaseState {
  getPos: () => {x: number, y: number}
  getTargetPos: () => {x: number, y: number};
}

interface PrivateState {
  pos: P5.Vector;
}

export const Camera = (
  p5: P5,
  state: MyState,
): Entity<CameraState> => {
  const privateState: PrivateState = {
    pos: p5.createVector(0, 0),
  };
  const localState: CameraState = {
    getTargetPos: () => ({x: 0, y: 0}),
    unsubs: [],
    getPos: () => privateState.pos,
  };

  return {
    localState,
    update: () => {
      const {x, y} = localState.getTargetPos();

      privateState.pos.lerp(x, y, 0, 0.1);
    },
    draw: () => {
      p5.translate(
        -privateState.pos.x + p5.width/2/SCALE,
        -privateState.pos.y + p5.height/2/SCALE,
      );
    }
  }
};
