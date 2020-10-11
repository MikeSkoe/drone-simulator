import P5 = require('p5');
import * as Matter from 'matter-js';
import { withCollision } from './hooks/withCollision';
import { Gamepad } from './entities/Gamepad';
import { TileMap } from './entities/TileMap';
import { LevelData, MyState, SCALE } from './types';

const canvas = document.querySelector<HTMLDivElement>('#canvas');
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

export const initCanvas = (levelData: LevelData) => {
  new P5(
    (p5: P5) => {
      // matter
      const engine = Matter.Engine.create();
      engine.world.gravity.y = 0.33;

      const state: MyState = {
        health: 1,
        dialog: [],
        movable: true,
        engine,
      };

      // entities
      const gamepad = Gamepad();
      const tileMap = TileMap(p5, state, levelData);
      const children = [tileMap];

      Matter.Engine.run(engine);
      withCollision(engine);

      p5.setup = () => {
        p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        p5.pixelDensity(4);
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
          // webgl offset
          // p5.translate(-CANVAS_WIDTH/2, -CANVAS_HEIGHT/2)
          p5.background('black');
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
