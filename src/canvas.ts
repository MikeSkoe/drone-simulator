import P5 = require('p5');
import * as Matter from 'matter-js';
import { Copter } from './entities/Copter';
import { Grounds } from './entities/Ground';
import { Bonuses } from './entities/Bonus';
import { Camera } from './entities/Camera';
import { collisionChecking } from './hooks/withCollision';
import { DialogEmitter } from './entities/DialogEmitter';
import { MissionEmitter } from './entities/MissionEmitter';
import { MissionEntities } from './entities/MissionEntities';
import { Mission, DialogItem } from './types';

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

      // entities
      const copter = Copter(p5);
      const missionEmitter = MissionEmitter(
        p5,
        missionData,
        [200, -50],
      )
      const missions = MissionEntities(p5, engine.world);
      const dialogEmitter = DialogEmitter(
        p5,
        dialogData,
        [50, -50],
      );
      const grounds = Grounds(
        p5,
        groundsData,
      );
      const bonuses = Bonuses(
        p5,
        bonusesData,
      );
      const camera = Camera(
        p5,
        () => copter.state.body.position,
      );

      // matter setup
      Matter.World.add(
        engine.world,
        [
          copter.state.body,
          dialogEmitter.state.body,
          missionEmitter.state.body,
          ...grounds.map(ground => ground.state.body),
          ...bonuses.map(bonus => bonus.state.body),
        ]
      );
      Matter.Engine.run(engine);
      collisionChecking(engine);

      // p5 init
      p5.setup = () => {
        p5.createCanvas(window.innerWidth, window.innerHeight);
      };

      p5.draw = () => {
        p5.background(0);

        // update
        camera.update();
        grounds.forEach(ground => ground.update());
        bonuses.forEach(bonus => bonus.update());
        dialogEmitter.update();
        missions.update();
        missionEmitter.update();
        copter.update();

        // draw
        drawBG(
          p5,
          camera.state.pos.x / 2,
          camera.state.pos.y / 2,
        );

        camera.draw();
        grounds.forEach(ground => ground.draw());
        bonuses.forEach(bonus => bonus.draw());
        dialogEmitter.draw();
        missions.draw();
        missionEmitter.draw();
        copter.draw();
      };
    },
    canvas,
  );
}
