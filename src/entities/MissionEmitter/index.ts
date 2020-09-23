import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, BodyID, Mission, BaseState, MyState } from '../../types';
import { $collisionStart } from '../../state';

const RADIUS = 25;

enum MissionState {
  New,
  Progress,
  Done,
}

interface MissionEmitterState extends BaseState {
  missionState: MissionState;
}

export const MissionEmitter = (
  p5: P5,
  state: MyState,
  mission: Mission,
  [x, y]: [number, number],
): Entity<MissionEmitterState> => {
  const localState: MissionEmitterState = {
    bodies: [
      Matter.Bodies.circle(
        x, y, RADIUS,
        {
          isStatic: true,
          isSensor: true,
          id: BodyID.MissionEmitter,
        },
      ),
      Matter.Bodies.circle(
        ...mission.target.pos, RADIUS,
        {
          isStatic: true,
          isSensor: true,
          id: BodyID.MissionTarget,
        }
      )
    ],
    unsubs: [
      $collisionStart
        .observable.subscribe(([id1, id2]) => {
          if (
            id1 === BodyID.MissionEmitter
            || id2 === BodyID.MissionEmitter
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
        .observable.subscribe(([id1, id2]) => {
          if (
            id1 === BodyID.MissionTarget
            || id2 === BodyID.MissionTarget
          ) {
            if (localState.missionState === MissionState.Progress) {
              localState.missionState = MissionState.Done;
            }
          }
        })
        .unsubscribe,
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

