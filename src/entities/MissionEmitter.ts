import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, Mission, BaseState, MyState, BodyLabel, InteractionStatus, PressKey } from '../types';
import { $collisionEnd, $collisionStart, $dialog, $pressed } from '../state';
import { addToWorld } from '../hooks/addToWorld';

const RADIUS = 5;

export interface MissionEmitterState extends BaseState {
  addEmitter: (pos: [number, number], mission: Mission) => void;
  addTarget: (pos: [number, number]) => void;
}

interface PrivateState {
  emitterBodies: Matter.Body[];
  targetBodies: Matter.Body[];
  status: InteractionStatus;
  missions: Mission[];
}

const onActionPressed = (privateState: PrivateState) => () => {
  switch(privateState.status) {
    case InteractionStatus.CanInteract:
      privateState.status = InteractionStatus.Speaking;
      $dialog.next(() => privateState.missions.map(mission => ({
        speaker: mission.title,
        speach: mission.description,
      })));
      break;

    default: break;
    
  }
}

const onEndSpeaking = (state: MyState, privateState: PrivateState) => () => {
  if (privateState.status === InteractionStatus.Speaking) {
    privateState.status = InteractionStatus.Doing;
    state.targetPosition = privateState.targetBodies[0].position;
  }
}

const onCollisionEnd = (privateState: PrivateState) => () => {
  if (privateState.status === InteractionStatus.CanInteract) {
    privateState.status = InteractionStatus.New;
  }
}

const onStartCollisionWithTarget = (state: MyState, privateState: PrivateState) => () => {
  if (privateState.status === InteractionStatus.Doing) {
    privateState.status = InteractionStatus.Returning;
    state.targetPosition = privateState.emitterBodies[0].position;
  }
}

const onStartCollisionWithEmitter = (p5: P5, state: MyState, privateState: PrivateState) => () => {
  if (privateState.status === InteractionStatus.New) {
    privateState.status = InteractionStatus.CanInteract;
  } else if (privateState.status === InteractionStatus.Returning) {
    privateState.status = InteractionStatus.Done;
    state.targetPosition = p5.createVector();
    $dialog.next(() => [{
      speaker: 'Speaker',
      speach: 'Done! Thanks!',
    }])
  }
}

export const MissionEmitter = (
  p5: P5,
  state: MyState,
): Entity<MissionEmitterState> => {
  const privateState: PrivateState = {
    emitterBodies: [],
    targetBodies: [],
    status: InteractionStatus.New,
    missions: [],
  }
  const unsubs: (() => void)[] = [
    $collisionStart.observable
      .filter(labels => labels.includes(BodyLabel.MissionEmitter))
      .subscribe(onStartCollisionWithEmitter(p5, state, privateState))
      .unsub,
    
    $collisionStart.observable
      .filter(labels => labels.includes(BodyLabel.MissionTarget))
      .subscribe(onStartCollisionWithTarget(state, privateState))
      .unsub,

      $collisionEnd.observable
        .filter(labels => labels.includes(BodyLabel.MissionEmitter))
        .subscribe(onCollisionEnd(privateState))
        .unsub,

      $pressed.observable
        .filter(key => key === PressKey.Action)
        .subscribe(onActionPressed(privateState))
        .unsub,
      
      $dialog.observable
        .filter(dialog => dialog.length === 0)
        .subscribe(onEndSpeaking(state, privateState))
        .unsub,
  ]

  const localState: MissionEmitterState = {
    addEmitter: (pos, mission) => {
      const emitterBody = Matter.Bodies.circle(
        ...pos, RADIUS * 4,
        {
          isStatic: true,
          isSensor: true,
          label: BodyLabel.MissionEmitter,
        },
      );

      privateState.emitterBodies.push(emitterBody);
      privateState.missions.push(mission);
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

      privateState.targetBodies.push(targetBody);
      addToWorld(state.engine, [targetBody]);
    },
    unsubs,
  };

  return {
    localState,
    update: () => { },
    draw: () => {
      p5.push();
      {
        p5.noStroke();

        for (const emitter of privateState.emitterBodies) {
          p5.fill(255, 0, 255);
          p5.circle(
            emitter.position.x,
            emitter.position.y,
            RADIUS * 2,
          );
          p5.fill('yellow');
          if (privateState.status === InteractionStatus.CanInteract) {
            p5.rect(
              emitter.position.x - 2.5,
              emitter.position.y - 20,
              5,
              10,
            )
          }
        }

        for (const target of privateState.targetBodies) {
          p5.fill(255, 255, 0);
          if (privateState.status === InteractionStatus.Doing) {
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

