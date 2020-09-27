import * as Matter from 'matter-js';

export interface BaseState {
  unsubs: (() => void)[];
}

export interface Entity<LocalState extends BaseState> {
  localState: LocalState;
  draw: () => void;
  update: () => void;
}

export enum BodyID {
  Copter = 1,
  Bonus = 2,
  Ground = 3,
  DialogEmitter = 4,
  MissionEmitter = 5,
  MissionTarget = 6,
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

export type LevelData = {
  mission: Mission,
  dialog: DialogItem[],
  grounds: [x: number, y: number, w: number, h: number][];
  bonuses: [x: number, y: number][];
}

export type TileMapLayer = {
  name: 'tiles';
  gridCellWidth: number;
  gridCellHeight: number;
  gridCellsX: number;
  gridCellsY: number;
  tileset: string;
  dataCoords2D: [number, number][][];
}

export type TileMapGroundLayer = {
  name: 'grounds';
  gridCellWidth: number;
  gridCellHeight: number;
  gridCellsX: number;
  gridCellsY: number;
  entities: {
    x: number;
    y: number;
    width: number;
    height: number;
    originX: number;
    originY: number;
  }[];
}

export type TileMap = {
  width: number;
  height: number;
  layers: TileMapLayer[];
}

