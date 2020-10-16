import P5 = require('p5');
import { Entity, BaseState, MyState, SCALE } from '../../types';

export interface CameraState extends BaseState {
  pos: P5.Vector;
  getTargetPos: () => {x: number, y: number};
}

export const Camera = (
  p5: P5,
  state: MyState,
): Entity<CameraState> => {
  const pos = p5.createVector(0, 0);
  const localState: CameraState = {
    pos,
    getTargetPos: () => ({x: 0, y: 0}),
    unsubs: [],
  };

  return {
    localState,
    update: () => {
      const {x, y} = localState.getTargetPos();

      localState.pos.lerp(x, y, 0, 0.1);
    },
    draw: () => {
      p5.translate(
        -localState.pos.x + p5.width/2/SCALE,
        -localState.pos.y + p5.height/2/SCALE,
      );
    }
  }
};
