import * as Matter from 'matter-js';

export const SCALE = 5;

export interface BaseState {
  unsubs: (() => void)[];
}

export interface Entity<LocalState extends BaseState> {
  localState: LocalState;
  draw: () => void;
  update: () => void;
  preload?: () => void;
}

export enum BodyID {
  Copter = 100,
  Bonus,
  Ground,
  DialogEmitter,
  MissionEmitter,
  MissionTarget,
}

export interface DialogItem {
  speaker: string;
  speach: string;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  target: {
    pos: [number, number];
  };
  progress: 'new' | 'progress' | 'done';
}

export type MyState =
  {
    health: number;
    engine: Matter.Engine,
    dialog: [];
    movable: true;
  }
  | {
    health: number;
    engine: Matter.Engine,
    dialog: DialogItem[];
    movable: false;
  }

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
    name: 'copter' | 'ground' | 'bonus' | 'dialog_emitter' | 'mission_emitter' | 'mission_target';
    x: number;
    y: number;
    width: number;
    height: number;
    originX: number;
    originY: number;
    title: string;
    description: string;
  }[];
}

export type LevelData = {
  width: number;
  height: number;
  layers: (TileMapLayer | TileMapGroundLayer)[];
}

