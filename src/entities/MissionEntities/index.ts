import P5 = require('p5');
import * as Matter from 'matter-js';
import { Mission, Entity, BodyID } from '../../types';
import { $currentMission, $collisionStart } from '../../state';

interface MissionEntitiesState {
  body: Matter.Body | undefined;
  mission: Mission | undefined;
}

export const MissionEntities = (
  p5: P5,
  world: Matter.World,
): Entity<MissionEntitiesState> => {
  const radius = 20;
  const state: MissionEntitiesState = {
    body: undefined,
    mission: undefined,
  };

  $collisionStart.observable.subscribe(
    ([id1, id2]) => {
      if (
        id1 === BodyID.MissionItemTarget
        || id2 === BodyID.MissionItemTarget
      ) {
        $currentMission.next(
          ([mission]) => [{
            ...mission,
            progress: 'done',
          }],
        );
      }
    }
  );

  $currentMission.observable.subscribe(
    ([newMission])=> {
      console.log('current', newMission);

      if (!newMission || newMission.progress !== 'progress') {
        if (state.body) {
          Matter.World.remove(
            world,
            state.body,
          );
          state.body = undefined;
        }
        if (state.mission) {
          state.mission = undefined;
        }

        return;
      }

      state.mission = newMission;
      state.body = Matter.Bodies.circle(
        newMission.item.targetPosition[0],
        newMission.item.targetPosition[1],
        radius,
        {
          isStatic: true,
          isSensor: true,
          id: BodyID.MissionItemTarget,
        },
      );

      Matter.World.add(
        world,
        state.body,
      );
    },
  );

  return {
    state,
    update: () => { },
    draw: () => {
      if (state.body) {
        p5.push();
        p5.noStroke();
        p5.fill(255, 0, 0);
        p5.circle(
          state.body.position.x,
          state.body.position.y,
          radius * 2,
        );
        p5.pop();
      }
    },
  }
}

