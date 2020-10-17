import { createState } from '../TypeScriptUI';
import { GameState, BodyLabel, DialogItem, PressKey } from '../types';

export const $collisionStart = createState<[BodyLabel | undefined, BodyLabel | undefined]>([undefined, undefined]);
export const $collisionEnd = createState<[BodyLabel | undefined, BodyLabel | undefined]>([undefined, undefined]);
export const $collisionActive = createState<[BodyLabel | undefined, BodyLabel | undefined]>([undefined, undefined]);
export const $dialog = createState<DialogItem[]>([]);
export const $nrg = createState(1);
export const $pressed = createState(PressKey.Action);
export const $gameState = createState<GameState>({type: 'menu'});
export const $pause = createState(true);
