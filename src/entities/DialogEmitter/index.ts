import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, DialogItem, BaseState, MyState, BodyLabel } from '../../types';
import { $collisionStart, $dialog, $keyPressed, $nextDialogItem, $padKeyPressed } from '../../state';
import { addToWorld } from '../../hooks/addToWorld';

const RADIUS = 5;

export interface DialogEmitterState extends BaseState{
  dialog: DialogItem[];
  status: 'new' | 'speaking' | 'done';
  addDialog: (pos: [number, number], dialogPath: string) => void;
}

export const DialogEmitter = (
  p5: P5,
  state: MyState,
): Entity<DialogEmitterState> => {
  const bodies: Matter.Body[] = [];
  const dialog: DialogItem[] = [];
  const unsubs: (() => void)[] = [
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

      $dialog.observable
        .subscribe(dialog => {
          if (dialog.length > 0) {
            state.movable = false;
          } else {
            state.movable = true;
          }
        })
        .unsubscribe,
    ];

  const localState: DialogEmitterState = {
    status: 'new',
    addDialog: (pos, dialogPath) => {
      fetch(dialogPath)
        .then(data => data.json())
        .then(dialog => {
          localState.dialog = dialog;

          const body = Matter.Bodies.circle(
            ...pos, RADIUS,
            {
              isStatic: true,
              isSensor: true,
              label: BodyLabel.DialogEmitter,
            },
          );

          bodies.push(body);
          unsubs.push(addToWorld(state.engine, [body]));
        })
        .catch(console.log);
    },
    dialog,
    unsubs,
  };


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
        for (const body of bodies) {
          p5.circle(
            body.position.x,
            body.position.y,
            RADIUS * 2,
          );
        }
      }
      p5.pop();
    },
  };
}
