import P5 = require('p5');
import * as Matter from 'matter-js';
import { withCollision } from './hooks/withCollision';
import { Gamepad } from './entities/Gamepad';
import { TileMap } from './entities/TileMap';
import { LevelData, MyState, SCALE } from './types';

import levelJSON from './data/level1.json';

const levelData = levelJSON as LevelData;

const canvas = document.querySelector<HTMLDivElement>('#canvas');

export const initCanvas = () => {
  new P5(
    (p5: P5) => {
      // matter
      const engine = Matter.Engine.create();
      engine.world.gravity.y = 0.5;
      const state: MyState = {
        health: 1,
        dialog: [],
        movable: true,
        engine,
      };

      // entities
      const gamepad = Gamepad();
      const tileMap = TileMap(p5, state, levelData);

      const children = [
        tileMap,
      ];

      Matter.Engine.run(engine);
      withCollision(engine);

      p5.setup = () => {
        p5.createCanvas(window.innerWidth, window.innerHeight);
      };

      p5.preload = () => {
        for (const child of children) {
          child.preload?.();
        }
      }

      p5.draw = () => {

        // update
        gamepad.update();

        for (const child of children) {
          child.update();
        }

        // draw
        p5.push();
        {
          p5.background('#54627e');
          p5.noSmooth();
          p5.scale(SCALE);

          for (const child of children) {
            child.draw();
          }
        }
        p5.pop();
      };
    },
    canvas,
  );
}
