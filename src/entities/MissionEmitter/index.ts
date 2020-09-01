import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, BodyID, Mission } from '../../types';
import {
  $currentMission,
  $missionDetail,
  $collisionStart,
  $doneMissions,
} from '../../state';

interface MissionEmitterState {
  body: Matter.Body;
  mission: Mission;
}

export const MissionEmitter = (
  p5: P5,
  mission: Mission,
  [x, y]: [number, number],
): Entity<MissionEmitterState> => {
  const radius = 25;
  let progress: Mission['progress'] = 'new';

  $collisionStart.observable.subscribe(
    ([id1, id2]) => {
      if (
        id1 === BodyID.MissionEmitter
        || id2 === BodyID.MissionEmitter
      ) {
        if (progress !== 'done') {
          $missionDetail.next(() => [mission])
        }
      }
    }
  );

  const currentMissionSubscription = $currentMission.observable.subscribe(
    ([currentMission])=> {
      if (currentMission && currentMission.id === mission.id) {
        if (currentMission.progress !== 'done') {
          progress = currentMission.progress;
        }
      } else {
        progress = 'new';
      }
    }
  );

  $doneMissions.observable.subscribe(
    doneMissions => {
      if (doneMissions.some(msn => msn.id === mission.id)) {
        progress = 'done';
        currentMissionSubscription.unsubscribe();
      }
    }
  )

  const body = Matter.Bodies.circle(
    x, y, radius,
    {
      isStatic: true,
      isSensor: true,
      id: BodyID.MissionEmitter,
    },
  );

  const state: MissionEmitterState = {
    body,
    mission,
  };

  return {
    state,
    update: () => {},
    draw: () => {
      p5.push();
      p5.noStroke();
      p5.fill(255, 0, 255);
      p5.circle(
        body.position.x,
        body.position.y,
        radius * 2,
      );

      p5.fill(255, 255, 0);
      if (progress === 'new') {
        p5.rect(
          body.position.x - 5,
          body.position.y - 80,
          10,
          40,
        )
      }

      if (progress === 'progress') {
        p5.circle(
          body.position.x,
          body.position.y - 50,
          30,
        )
      }
      p5.pop();
    },
  };
}
