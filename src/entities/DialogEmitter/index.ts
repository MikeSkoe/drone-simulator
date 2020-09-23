import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, BodyID, DialogItem, BaseState, MyState } from '../../types';
import { $collisionStart, $dialog } from '../../state';
import { isButtonPressed } from '../Gamepad';

const RADIUS = 25;

interface DialogEmitterState extends BaseState{ }

export const DialogEmitter = (
  p5: P5,
  state: MyState,
  dialog: DialogItem[],
  [x, y]: [number, number],
): Entity<DialogEmitterState> => {
  const localState = {
    bodies: [
      Matter.Bodies.circle(
        x, y, RADIUS,
        {
          isStatic: true,
          isSensor: true,
          id: BodyID.DialogEmitter,
        },
      ),
    ],
    unsubs: [
      $collisionStart
        .observable.subscribe(([id1, id2]) => {
          if (id1 === BodyID.DialogEmitter
            || id2 === BodyID.DialogEmitter
          ) {
            if (state.dialog.length === 0) {
              state.movable = false;
              state.dialog = dialog;
              $dialog.next(() => dialog);
            }
          }
        })
        .unsubscribe,
    ],
  };

  return {
    localState,
    update: () => {
      const xButton = isButtonPressed(0);

      if (xButton) {
        if (state.dialog.length > 0) {
          const newDialog = state.dialog.slice(1);
          state.dialog = newDialog;
          $dialog.next(() => newDialog);

          if (newDialog.length === 0) {
            state.movable = true;
          }
        }
      }
    },
    draw: () => {
      p5.push();
      {
        p5.noStroke();
        p5.fill(255, 255, 0);
        localState.bodies.forEach(body => {
          p5.circle(
            body.position.x,
            body.position.y,
            RADIUS * 2,
          );
        });
      }
      p5.pop();
    },
  };
}
