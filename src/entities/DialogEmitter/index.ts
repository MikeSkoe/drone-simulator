import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, DialogItem, BaseState, MyState, BodyLabel } from '../../types';
import { $collisionStart, $dialog } from '../../state';
import { isButtonPressed } from '../Gamepad';
import { addToWorld } from '../../hooks/addToWorld';

const RADIUS = 5;

export interface DialogEmitterState extends BaseState{
  dialog: DialogItem[],
}

export const DialogEmitter = (
  p5: P5,
  state: MyState,
  [x, y]: [number, number],
  dialogPath: string,
): Entity<DialogEmitterState> => {
  const bodies = [
    Matter.Bodies.circle(
      x, y, RADIUS,
      {
        isStatic: true,
        isSensor: true,
        label: BodyLabel.DialogEmitter,
      },
    ),
  ];

  const localState = {
    dialog: [],
    unsubs: [
      $collisionStart
        .observable.subscribe(([labelA, labelB]) => {
          if (labelA === BodyLabel.DialogEmitter
            || labelB === BodyLabel.DialogEmitter
          ) {
            if (state.dialog.length === 0) {
              state.movable = false;
              state.dialog = localState.dialog;
              $dialog.next(() => localState.dialog);
            }
          }
        })
        .unsubscribe,

      addToWorld(state.engine, bodies),
    ],
  };

  fetch(dialogPath)
    .then(data => data.json())
    .then(dialog => localState.dialog = dialog)
    .catch(console.log);

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
        p5.fill(0, 255, 0);
        bodies.forEach(body => {
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
