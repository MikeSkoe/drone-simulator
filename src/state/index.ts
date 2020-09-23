import createState from '../TypeScriptUI/lib/ZenPushStream';
import { DialogItem } from '../types';

export const $collisionStart = createState<[number, number]>([0, 0]);
export const $collisionActive = createState<[number, number]>([0, 0]);
export const $dialog = createState<DialogItem[]>([]);

