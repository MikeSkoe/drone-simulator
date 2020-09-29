import P5 = require('p5');
import { Entity, BaseState, MyState, SCALE } from '../../types';

export interface CameraState extends BaseState {
  pos: P5.Vector;
}

export const Camera = (
  p5: P5,
  state: MyState,
  getTargetPos: () => Matter.Vector,
): Entity<CameraState> => {
  const localState: CameraState = {
    pos: p5.createVector(
      getTargetPos().x,
      getTargetPos().y,
    ),
    unsubs: [],
  };

  return {
    localState,
    update: () => {
      const {x, y} = getTargetPos();

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
