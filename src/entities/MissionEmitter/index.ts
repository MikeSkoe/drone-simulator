import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, Mission, BaseState, MyState, BodyLabel } from '../../types';
import { $collisionStart } from '../../state';
import { addToWorld } from '../../hooks/addToWorld';

const RADIUS = 5;

enum MissionState {
  New,
  Progress,
  Done,
}

export interface MissionEmitterState extends BaseState {
  missionState: MissionState;
}

export const MissionEmitter = (
  p5: P5,
  state: MyState,
  mission: Mission,
  [x, y]: [number, number],
): Entity<MissionEmitterState> => {
  const bodies = [
    Matter.Bodies.circle(
      x, y, RADIUS,
      {
        isStatic: true,
        isSensor: true,
        label: BodyLabel.MissionEmitter,
      },
    ),
    Matter.Bodies.circle(
      ...mission.target.pos, RADIUS,
      {
        isStatic: true,
        isSensor: true,
        label: BodyLabel.MissionTarget,
      }
    )
  ];

  const localState: MissionEmitterState = {
    unsubs: [
      $collisionStart
        .observable.subscribe(([labelA, labelB]) => {
          if (
            labelA === BodyLabel.MissionEmitter
            || labelB === BodyLabel.MissionEmitter
          ) {
            switch (localState.missionState) {
              case MissionState.New:
                localState.missionState = MissionState.Progress;
                break;
              case MissionState.Done:
                console.log('done!!!');
                break;
              default: break;
            }
          }
        })
        .unsubscribe,

      $collisionStart
        .observable.subscribe(([labelA, labelB]) => {
          if (
            labelA === BodyLabel.MissionTarget
            || labelB === BodyLabel.MissionTarget
          ) {
            if (localState.missionState === MissionState.Progress) {
              localState.missionState = MissionState.Done;
            }
          }
        })
        .unsubscribe,

      addToWorld(state.engine, bodies),
    ],
    missionState: MissionState.New,
  };

  return {
    localState,
    update: () => { },
    draw: () => {
      p5.push();
      {
        p5.noStroke();
        p5.fill(255, 0, 255);
        p5.circle(
          x,
          y,
          RADIUS * 2,
        );
        p5.fill(255, 255, 0);

        if (localState.missionState === MissionState.Progress) {
          p5.circle(
            ...mission.target.pos,
            RADIUS * 2,
          );
        }
      }
      p5.pop();
    },
  };
};

