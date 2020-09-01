import { DialogItem, Mission } from '../types';
import createState from '../TypeScriptUI/lib/ZenPushStream';

export const $collisionStart = createState<[number, number]>([0, 0]);
export const $collisionActive = createState<[number, number]>([0, 0]);

export const $health = createState(1);
export const $dialog = createState<DialogItem[]>([]);
export const $missionDetail = createState<[Mission] | []>([]);
export const $currentMission = createState<[Mission] | []>([]);
export const $doneMissions = createState<Mission[]>([]);

