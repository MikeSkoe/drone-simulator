import P5 = require('p5');
import { Entity, MyState, BaseState, LevelData } from '../../types';
import { CopterState, Copter } from '../Copter';
import { Bonuses, BonusState } from '../Bonus';
import { Camera, CameraState } from '../Camera';
import { Health, HealthState } from '../Health';
import { MissionEmitter, MissionEmitterState } from '../MissionEmitter';
import { Grounds, GroundState } from '../Ground';
import { DialogEmitter, DialogEmitterState } from '../DialogEmitter';

const img = '/data/block.png';

const drawToBuffer = (
  data: LevelData,
  tileBuffer: P5.Graphics,
  imageData: P5.Image,
) => {
  for (const layer of data.layers) {
    if (layer.name === 'tilemap') {
      const {gridCellWidth, gridCellHeight, dataCoords2D} = layer;
      const rowSize = data.width / gridCellWidth;
      const columnSize = data.height / gridCellHeight;

      for ( let y = 0; y < columnSize; y++) {
        for (let x = 0; x < rowSize; x++) {
          const xPos = x * gridCellWidth;
          const yPos = y * gridCellHeight;
          const [tileX, tileY] = dataCoords2D[y][x];

          tileBuffer.image(
            imageData,
            xPos, yPos,
            gridCellWidth, gridCellHeight,
            tileX * gridCellWidth, tileY * gridCellHeight,
            8, 8,
          );
        }
      }
    }
  }
}

const getEntities = (p5: P5, state: MyState, levels: LevelData['layers']) => {
  let copter: Entity<CopterState>;
  let bonuses: Entity<BonusState>;
  let missionEmitter: Entity<MissionEmitterState>;
  let grounds: Entity<GroundState>;
  let camera: Entity<CameraState>;
  let health: Entity<HealthState>;
  let dialogEmitter: Entity<DialogEmitterState>;

  for (const level of levels) {
    if (level.name === 'entity') {
      const {x: copterX, y: copterY, width: copterWidth, height: copterHeight}
        = level.entities.find(entity => entity.name === 'copter');
      const bonusesData
        = level.entities.filter(entity => entity.name === 'bonus');
      const {values: {title, description}, x: missionEmitterX, y: missionEmitterY}
        = level.entities.find(entity => entity.name === 'mission_emitter');
      const {x: targetX, y: targetY}
        = level.entities.find(entity => entity.name === 'mission_target');
      const {values: {path: dialogPath}, x: dialogX, y: dialogY, }
        = level.entities.find(entity => entity.name === 'dialog_emitter');
      const groundPositions
        = level.entities
          .filter(entity => entity.name === 'ground')
          .map(ground => [ground.x, ground.y, ground.width, ground.height] as [x: number, y: number, w: number, h: number]);

      missionEmitter = MissionEmitter(
        p5,
        state,
        {title, description, target: { pos: [targetX, targetY]}, id: Math.random(), progress: 'new'},
        [missionEmitterX, missionEmitterY],
      );
      copter = Copter(p5, state, [copterX, copterY], [copterWidth, copterHeight*.75]);
      bonuses = Bonuses(p5, state, bonusesData.map(data => [data.x, data.y]))
      grounds = Grounds(p5, state, groundPositions)
      camera = Camera(p5, state, () => copter.localState.pos);
      health = Health(p5, state);
      dialogEmitter = DialogEmitter(p5, state, [dialogX, dialogY], dialogPath);
    }
  }

  return {copter, bonuses, missionEmitter, grounds, camera, health, dialogEmitter};
}

interface TileMapState extends BaseState { }

export const TileMap = (
  p5: P5,
  state: MyState,
  data: LevelData,
): Entity<TileMapState> => {
  const {width, height, layers} = data;
  const tileBuffer = p5.createGraphics(width, height);
  let imageData: P5.Image;
  let bufferRendered = false;

  const {
    health,
    camera,
    copter,
    bonuses,
    missionEmitter,
    grounds,
    dialogEmitter,
  } = getEntities(p5, state, layers);
  const children = [
    grounds,
    bonuses,
    missionEmitter,
    dialogEmitter,
    copter,
  ];
  const localState: TileMapState = {
    unsubs: [],
  };

  return {
    localState,
    preload: () => {
      imageData = p5.loadImage(img);

      for (const child of children) {
        child.preload?.();
      }
    },
    update: () => {
      camera.update();
      health.update();

      for (const child of children) {
        child.update();
      }
    },
    draw: () => {
      if (!bufferRendered) {
        tileBuffer.noSmooth();
        drawToBuffer(data, tileBuffer, imageData);
        bufferRendered = true;
      }

      p5.push();
      {
        camera.draw();

        p5.image(tileBuffer, 0, 0);

        for (const child of children) {
          child.draw();
        }
      }
      p5.pop();
      health.draw();
    },
  };
};

