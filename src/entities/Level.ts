import P5 = require('p5');
import { Entity, MyState, BaseState, LevelData, SCALE } from '../types';
import { CopterState, Copter } from './Copter';
import { Bonuses, BonusState } from './Bonus';
import { Arrow } from './Arrow';
import { Camera } from './Camera';
import { MissionEmitter, MissionEmitterState } from './MissionEmitter';
import { Grounds, GroundState } from './Ground';
import { DialogEmitter, DialogEmitterState } from './DialogEmitter';
import { Pressed } from './Pressed';
import { TileMap, TileMapState } from './TileMap';
import { withCollision } from '../hooks/withCollision';
import { withDialogs } from '../hooks/withDialogs';

const drawBG = (p5: P5, xOffset: number, yOffset: number) => {
  const w = p5.width;
  const h = p5.height;
  const s = 60;

  p5.push();
  {
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
  }
  p5.pop();
};

const getEntities = (
  levelPath: string,
  {
    tileMap,
    copter,
    bonuses,
    missionEmitter,
    grounds,
    dialogEmitter,
  }: {
    tileMap: Entity<TileMapState>;
    copter: Entity<CopterState>;
    bonuses: Entity<BonusState>;
    missionEmitter: Entity<MissionEmitterState>;
    grounds: Entity<GroundState>;
    dialogEmitter: Entity<DialogEmitterState>;
  }
) => {
  fetch(levelPath)
    .then(data => data.json())
    .then((data: LevelData) => {
      for (const layer of data.layers) {
        if (layer.name === 'tilemap') {
          tileMap.localState.setTileMap([data.width, data.height], layer);
        }

        if (layer.name === 'entity') {
          for (const entity of layer.entities) {
            switch(entity.name) {
              case 'copter':
                copter.localState.setPos([entity.x, entity.y]);
                break;

              case 'bonus':
                bonuses.localState.addBonus(entity.x, entity.y);
                break;

              case 'mission_emitter':
                missionEmitter.localState.addEmitter(
                  [entity.x, entity.y],
                  JSON.parse(entity.values.dialog),
                );
                break;

              case 'mission_target':
                missionEmitter.localState.addTarget([entity.x, entity.y]);
                break;

              case 'dialog_emitter':
                dialogEmitter.localState.addDialog(
                  [entity.x, entity.y],
                  JSON.parse(entity.values.dialog),
                );
                break;

              case 'ground':
                grounds.localState.addGround([entity.x, entity.y], [entity.width, entity.height])
                break;

              default: break;
            }
          }
    }
  }
  })
  .catch(console.log);
}

interface LevelState extends BaseState {
  loadLevel: (levelPath: string) => void;
  unloadLevel: () => void;
}

export const Level = (
  p5: P5,
  state: MyState,
): Entity<LevelState> => {
  const copter = Copter(p5, state);
  const camera = Camera(p5, state);
  const missionEmitter = MissionEmitter(p5, state);
  const bonuses = Bonuses(p5, state);
  const grounds = Grounds(p5, state);
  const dialogEmitter = DialogEmitter(p5, state);
  const tileMap = TileMap(p5, state);
  const arrow = Arrow(p5, state);
  arrow.localState.getPositionA = () => camera.localState.getTargetPos();
  arrow.localState.getPositionB = () => state.targetPosition;

  const children: Entity[] = [
    tileMap,
    copter,
    missionEmitter,
    bonuses,
    grounds,
    dialogEmitter,
  ];

  const localState: LevelState = {
    unsubs: [
      ...Pressed(),
      ...withCollision(state.engine),
      ...withDialogs(state),
    ],
    loadLevel: path => {
      getEntities(path, {
        tileMap,
        copter,
        missionEmitter,
        bonuses,
        grounds,
        dialogEmitter,
      });
      camera.localState.getTargetPos = copter.localState.getPos;
    },
    unloadLevel: () => {
      for (const child of children) {
        for (const unsub of child.localState.unsubs) {
          unsub();
        }
      }
    },
  };

  return {
    localState,

    preload: () => {
      for (const child of children) {
        child.preload?.();
      }
    },

    update: () => {
      if ( state.paused || state.gameState !== 'game') {
        return;
      }

      camera.update();

      for (const child of children) {
        child.update();
      }
      arrow.update();
    },

    draw: () => {
      if (state.gameState !== 'game') {
        return;
      }

      p5.push();
      {
        p5.noSmooth();
        p5.scale(SCALE);
        const {x: cameraX, y: cameraY} = camera.localState.getPos();

        drawBG(p5, cameraX / 2, cameraY / 2);

        arrow.draw();
        p5.push();
        {
          camera.draw();
          for (const child of children) {
            child.draw();
          }
        }
        p5.pop();

      }
      p5.pop();
    },
  };
};
