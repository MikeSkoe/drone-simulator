import P5 = require('p5');
import * as Matter from 'matter-js';
import { Entity, BodyID, DialogItem } from '../../types';
import { $collisionStart, $dialog } from '../../state';

interface DialogEmitterState {
  body: Matter.Body;
}

export const DialogEmitter = (
  p5: P5,
  dialog: DialogItem[],
  [x, y]: [number, number],
): Entity<DialogEmitterState> => {
  const radius = 25;

  $collisionStart.observable.subscribe(
    ([id1, id2]) => {
      if (
        id1 === BodyID.DialogEmitter
        || id2 === BodyID.DialogEmitter
      ) {
        $dialog.next(
          prevDialog => prevDialog.length > 0 ? prevDialog : dialog
        );
      }
    }
  );

  const body = Matter.Bodies.circle(
    x, y, radius,
    {
      isStatic: true,
      isSensor: true,
      id: BodyID.DialogEmitter,
    },
  );

  const state: DialogEmitterState = {
    body,
  };

  return {
    state,
    update: () => {},
    draw: () => {
      p5.push();
      p5.noStroke();
      p5.fill(255, 255, 0);
      p5.circle(
        body.position.x,
        body.position.y,
        radius * 2,
      );
      p5.pop();
    },
  };
}
