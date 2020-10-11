import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, DialogItem, BaseState, MyState, BodyLabel } from '../../types';
import { $collisionStart, $dialog, $keyPressed, $nextDialogItem, $padKeyPressed } from '../../state';
import { addToWorld } from '../../hooks/addToWorld';

const RADIUS = 5;

export interface DialogEmitterState extends BaseState{
  dialog: DialogItem[];
  status: 'new' | 'speaking' | 'done';
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

  const localState: DialogEmitterState = {
    status: 'new',
    dialog: [],
    unsubs: [
      addToWorld(state.engine, bodies),
      $collisionStart.observable
        .subscribe(([labelA, labelB]) => {
          if (localState.status !== 'new') {
            return;
          }

          if (labelA === BodyLabel.DialogEmitter
            || labelB === BodyLabel.DialogEmitter
          ) {
            $dialog.next(() => localState.dialog);
            localState.status = 'speaking';
          }
        })
        .unsubscribe,

      $padKeyPressed.observable
        .subscribe(padKey => {
          if (padKey === 'x') {
            $nextDialogItem.next(() => void 0);
          }
        })
        .unsubscribe,
      
      $keyPressed.observable
        .subscribe(key => {
          console.log('key', key);

          if (key === 'Enter') {
            $nextDialogItem.next(() => void 0);
          }
        })
        .unsubscribe,

      $nextDialogItem.observable
        .subscribe(() => {
          $dialog.next(dialog => dialog.slice(1));
        })
        .unsubscribe,
    ],
  };

  fetch(dialogPath)
    .then(data => data.json())
    .then(dialog => localState.dialog = dialog)
    .catch(console.log);

  return {
    localState,
    update: () => {
      if (localState.status !== 'done') {
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
