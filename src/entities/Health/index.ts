import P5 = require('p5');
import { Entity, BaseState, MyState, SCALE } from '../../types';

export interface HealthState extends BaseState { }

export const Health = (
  p5: P5,
  state: MyState,
): Entity<HealthState> =>{
  const localState: BaseState = {
    unsubs: [],
  };

  return {
    localState,
    update: () => {},
    draw: () => {
      p5.push();
      {
        p5.scale(1/SCALE)
        p5.rect(10, 10, state.health * 100, 20);
      }
      p5.pop();
    },
  };
};

