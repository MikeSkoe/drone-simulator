import P5 = require('p5');
import { Entity } from '../../types';

interface CameraState {
  pos: P5.Vector;
}

export const Camera = (
  p5: P5,
  getTargetPos: () => Matter.Vector,
): Entity<CameraState> => {
  const state: CameraState = {
    pos: p5.createVector(
      getTargetPos().x,
      getTargetPos().y,
    ),
  };

  return {
    state,
    update: () => {
      const {x, y} = getTargetPos();

      state.pos.lerp(x, y, 0, 0.1);
    },
    draw: () => {
      p5.translate(
        -state.pos.x + p5.width/2,
        -state.pos.y + p5.height/2,
      );
    }
  }
};
