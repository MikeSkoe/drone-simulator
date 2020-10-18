import P5 = require('p5');
import * as Matter from 'matter-js';
import { withCollision } from './hooks/withCollision';
import { Level } from './entities/Level';
import { MyState } from './types';
import { $gameState, $pause } from './state';
import { withDialogs } from './hooks/withDialogs';

const canvas = document.querySelector<HTMLDivElement>('#canvas');
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

export const initCanvas = () => {
  new P5(
    (p5: P5) => {
      // matter
      const runner = Matter.Runner.create();
      const engine = Matter.Engine.create();
      engine.world.gravity.y = 0.33;

      const state: MyState = {
        health: 1,
        movable: true,
        engine,
        paused: false,
        gameState: 'menu',
        targetPosition: {x: 0, y: 0},
      };

      // entities
      const level = Level(p5, state);
      const unsubs = [
        $gameState.observable
          .subscribe(gameState => {
            state.gameState = gameState.type;

            switch(gameState.type) {
              case 'game':
                level.localState.loadLevel(gameState.levelPath);
                $pause.next(() => false);
                break;
              
              case 'menu':
                $pause.next(() => true);
                break;
            }
          })
          .unsub,

        $pause.observable
          .subscribe(pause => {
            state.paused = pause;
            runner.enabled = !pause;
          })
          .unsub,
      ];

      p5.setup = () => {
        p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        Matter.Runner.run(runner, engine);
      };

      p5.preload = () => {
        level.preload();
      }

      p5.draw = () => {
        p5.background('black');

        // update
        level.update();

        // draw
        level.draw();
      };
    },
    canvas,
  );
}
