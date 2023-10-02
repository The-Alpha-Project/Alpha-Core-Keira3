import { TableRow } from './general';

export const GAMEOBJECT_QUESTSTARTER_TABLE = 'gameobject_quest_starter';
export const GAMEOBJECT_QUESTSTARTER_ID = 'quest';
export const GAMEOBJECT_QUESTSTARTER_ID_2 = 'entry';

export class GameobjectQueststarter extends TableRow {
  entry: number = 0;
  quest: number = 0;
}
