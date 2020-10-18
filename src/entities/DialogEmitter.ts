import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, DialogItem, BaseState, MyState, BodyLabel, InteractionStatus, PressKey } from '../types';
import { $canInteract, $collisionEnd, $collisionStart, $dialog, $pressed } from '../state';
import { addToWorld } from '../hooks/addToWorld';

const RADIUS = 5;

export interface DialogEmitterState extends BaseState{
  addDialog: (pos: [number, number], dialog: DialogItem[]) => void;
}

const getOnActionPressed = (
  privateState: PrivateState,
) => () => {
  switch (privateState.status) {
    case InteractionStatus.CanInteract:
      privateState.status = InteractionStatus.Speaking;
      $dialog.next(() => privateState.dialog);
      break;

    default: break;
  }
}

interface PrivateState {
  status: InteractionStatus;
  dialog: DialogItem[];
  bodies: Matter.Body[];
}

export const DialogEmitter = (
  p5: P5,
  state: MyState,
): Entity<DialogEmitterState> => {
  const privateState: PrivateState = {
    status: InteractionStatus.New,
    dialog: [],
    bodies: [],
  }
  const onActionPressed = getOnActionPressed(privateState);
  const unsubs: (() => void)[] = [
      $collisionStart.observable
        .filter(labels => labels.includes(BodyLabel.DialogEmitter))
        .subscribe(() => {
          if (privateState.status === InteractionStatus.Done) {
            return;
          }

          privateState.status = InteractionStatus.CanInteract;
          $canInteract.next(() => true);
        })
        .unsub,

      $collisionEnd.observable
        .filter(labels => labels.includes(BodyLabel.DialogEmitter))
        .subscribe(() => {
          if (privateState.status === InteractionStatus.CanInteract) {
            privateState.status = InteractionStatus.New;
          }

          $canInteract.next(() => false);
        })
        .unsub,

      $pressed.observable
        .filter(key => key === PressKey.Action)
        .subscribe(onActionPressed)
        .unsub,

      $dialog.observable
        .subscribe(dialog => {
          if (dialog.length === 0) {
            if (privateState.status === InteractionStatus.Speaking) {
              privateState.status = InteractionStatus.Done
            }
          } else {
            $canInteract.next(() => false);
          }
        })
        .unsub,
    ];

  const localState: DialogEmitterState = {
    addDialog: (pos, dialog) => {
      privateState.dialog = dialog;

      const body = Matter.Bodies.circle(
        ...pos, RADIUS * 4,
        {
          isStatic: true,
          isSensor: true,
          label: BodyLabel.DialogEmitter,
        },
      );

      privateState.bodies.push(body);
      unsubs.push(addToWorld(state.engine, [body]));
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
        p5.fill(0, 255, 0);
        for (const body of privateState.bodies) {
          p5.circle(
            body.position.x,
            body.position.y,
            RADIUS * 2,
          );

          p5.fill('yellow');
          if (privateState.status === InteractionStatus.CanInteract) {
            p5.rect(
              body.position.x - 2.5,
              body.position.y - 20,
              5,
              10,
            )
          }
        }
      }
      p5.pop();
    },
  };
}
