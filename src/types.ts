import * as Matter from 'matter-js';

export const SCALE = 2;
export enum LevelPath {
  First = '/data/level1.json',
};

export enum Key {
  Enter = 13,
  Left = 37,
  Up,
  Right,
};

export type GameState
  = { type: 'game', levelPath: string }
  | { type: 'menu' }

export interface BaseState {
  unsubs: (() => void)[];
}

export interface Entity<LocalState extends BaseState = BaseState> {
  localState: LocalState;
  draw: () => void;
  update: () => void;
  preload?: () => void;
}

export enum BodyLabel {
  Copter = 'Copter',
  Bonus = 'Bonus',
  Ground = 'Ground',
  DialogEmitter = 'DialogEmitter',
  MissionEmitter = 'MissionEmitter',
  MissionTarget = 'MissionTarget',
}

export interface DialogItem {
  speaker: string;
  speach: string;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
}

export type MyState = {
  health: number;
  engine: Matter.Engine,
  movable: boolean;
  paused: boolean;
  gameState: GameState['type'];
};

export type TileMapLayer = {
  name: 'tilemap';
  gridCellWidth: number;
  gridCellHeight: number;
  gridCellsX: number;
  gridCellsY: number;
  tileset: string;
  dataCoords2D: number[];
}

export type TileMapGroundLayer = {
  name: 'entity';
  gridCellWidth: number;
  gridCellHeight: number;
  gridCellsX: number;
  gridCellsY: number;
  entities: {
    name: 'copter' | 'ground' | 'bonus' | 'dialog_emitter' | 'mission_emitter' | 'mission_target' | 'dialog_emitter';
    x: number;
    y: number;
    width: number;
    height: number;
    originX: number;
    originY: number;
    values: {
      title: string;
      description: string;
      path: string;
    }
  }[];
}

export type LevelData = {
  width: number;
  height: number;
  layers: (TileMapLayer | TileMapGroundLayer)[];
}

