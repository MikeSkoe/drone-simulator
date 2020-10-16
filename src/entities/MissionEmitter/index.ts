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
  addEmitter: (pos: [number, number], mission: Mission) => void;
  addTarget: (pos: [number, number]) => void;
}

export const MissionEmitter = (
  p5: P5,
  state: MyState,
): Entity<MissionEmitterState> => {
  const emitterBodies: Matter.Body[] = [];
  const targetBodies: Matter.Body[] = [];
  const unsubs: (() => void)[] = [
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
  ]

  const localState: MissionEmitterState = {
    addEmitter: (pos, mission) => {
      const emitterBody = Matter.Bodies.circle(
        ...pos, RADIUS,
        {
          isStatic: true,
          isSensor: true,
          label: BodyLabel.MissionEmitter,
        },
      );

      emitterBodies.push(emitterBody);
      addToWorld(state.engine, [emitterBody]);
    },
    addTarget: (pos) => {
      const targetBody = Matter.Bodies.circle(
        ...pos, RADIUS,
        {
          isStatic: true,
          isSensor: true,
          label: BodyLabel.MissionTarget,
        }
      );

      targetBodies.push(targetBody);
      addToWorld(state.engine, [targetBody]);
    },
    unsubs,
    missionState: MissionState.New,
  };

  return {
    localState,
    update: () => { },
    draw: () => {
      p5.push();
      {
        p5.noStroke();

        for (const emitter of emitterBodies) {
          p5.fill(255, 0, 255);
          p5.circle(
            emitter.position.x,
            emitter.position.y,
            RADIUS * 2,
          );
        }

        for (const target of targetBodies) {
          p5.fill(255, 255, 0);
          if (localState.missionState === MissionState.Progress) {
            p5.circle(
              target.position.x,
              target.position.y,
              RADIUS * 2,
            );
          };
        }
      }
      p5.pop();
    },
  };
};

