export interface Entity<State = {}> {
  state: State;
  draw: () => void;
  update: () => void;
}

export enum BodyID {
  Copter = 1,
  Bonus = 2,
  Ground = 3,
  DialogEmitter = 4,
  MissionEmitter = 5,
  MissionItemTarget = 6,
}

export interface DialogItem {
  speaker: string;
  speach: string;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  item: {
    id: 'box';
    targetPosition: [number, number];
  };
  progress: 'new' | 'progress' | 'done';
}

