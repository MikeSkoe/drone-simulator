import { createState } from '../TypeScriptUI';
import { GameState, BodyLabel, DialogItem } from '../types';

export const $collisionStart = createState<[BodyLabel | undefined, BodyLabel | undefined]>([undefined, undefined]);
export const $collisionActive = createState<[BodyLabel | undefined, BodyLabel | undefined]>([undefined, undefined]);
export const $dialog = createState<DialogItem[]>([]);
export const $nextDialogItem = createState<void>();
export const $nrg = createState(1);
export const $keyPressed = createState('');
export const $padKeyPressed = createState('');
export const $gameState = createState<GameState>({type: 'game'});

