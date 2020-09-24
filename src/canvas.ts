import P5 = require('p5');
import * as Matter from 'matter-js';
import { Copter } from './entities/Copter';
import { Grounds } from './entities/Ground';
import { Bonuses } from './entities/Bonus';
import { Camera } from './entities/Camera';
import { withCollision } from './hooks/withCollision';
import { DialogEmitter } from './entities/DialogEmitter';
import { MissionEmitter } from './entities/MissionEmitter';
import { Health } from './entities/Health';
import { Gamepad } from './entities/Gamepad';
import { MyState, Mission, DialogItem } from './types';

import missionJSON from './data/missions/1.json';
import dialogJSON from './data/dialogs/1.json';
import groundsJSON from './data/grounds.json';
import bonusesJSON from './data/bonuses.json';

const missionData = missionJSON as Mission;
const dialogData = dialogJSON as DialogItem[];
const groundsData = groundsJSON as [x: number, y: number, w: number, h: number][];
const bonusesData = bonusesJSON as [x: number, y: number, r: number][];

const canvas = document.querySelector<HTMLDivElement>('#canvas');

const drawBG = (p5: P5, xOffset, yOffset) => {
  const w = p5.width;
  const h = p5.height;
  const s = 60;

  p5.push();
  p5.noStroke();

  for (let x = 0; x < w + s; x += s) {
    for (let y = 0; y < h + s; y += s) {
      p5.rect(
        x - xOffset % s,
        y - yOffset % s,
        2,
        2,
      );
    }
  }

  p5.pop();
};

export const initCanvas = () => {
  new P5(
    (p5: P5) => {
      // matter
      const engine = Matter.Engine.create();
      const state: MyState = {
        health: 1,
        dialog: [],
        movable: true,
        engine,
      };

      // entities
      const copter = Copter(p5, state);
      const missionEmitter = MissionEmitter(p5, state, missionData, [200, -50]);
      const dialogEmitter = DialogEmitter(p5, state, dialogData, [50, -50]);
      const grounds = Grounds(p5, state, groundsData);
      const bonuses = Bonuses(p5, state, bonusesData,);
      const camera = Camera(p5, state, () => copter.localState.pos);
      const health = Health(p5, state);
      const gamepad = Gamepad();

      Matter.Engine.run(engine);
      withCollision(engine);

      // p5 init
      p5.setup = () => {
        p5.createCanvas(window.innerWidth, window.innerHeight);
      };

      p5.draw = () => {
        p5.background(0);

        // update
        gamepad.update();
        camera.update();
        grounds.update();
        bonuses.update();
        dialogEmitter.update();
        missionEmitter.update();
        copter.update();
        health.update();

        // draw
        drawBG(
          p5,
          camera.localState.pos.x / 2,
          camera.localState.pos.y / 2,
        );

        p5.push();
        {
          camera.draw();
          grounds.draw();
          bonuses.draw();
          dialogEmitter.draw();
          missionEmitter.draw();
          copter.draw();
        }
        p5.pop();

        health.draw();
      };
    },
    canvas,
  );
}
