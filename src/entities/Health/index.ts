import P5 = require('p5');
import { Entity, BaseState, MyState } from '../../types';

interface HealthState extends BaseState { }

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
      p5.rect(10, 10, state.health * 100, 20);
    },
  };
};

