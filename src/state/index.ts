import { createState } from '../TypeScriptUI';
import { BodyLabel, DialogItem } from '../types';

export const $collisionStart = createState<[BodyLabel | undefined, BodyLabel | undefined]>([undefined, undefined]);
export const $collisionActive = createState<[BodyLabel | undefined, BodyLabel | undefined]>([undefined, undefined]);
export const $dialog = createState<DialogItem[]>([]);

