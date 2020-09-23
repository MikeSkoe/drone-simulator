import * as Matter from 'matter-js';

export interface BaseState {
  bodies: Matter.Body[];
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
    dialog: [];
    movable: true;
  }
  | {
    health: number;
    dialog: DialogItem[];
    movable: false;
  };

