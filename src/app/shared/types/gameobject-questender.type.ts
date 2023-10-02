import { TableRow } from './general';

export const GAMEOBJECT_QUESTENDER_TABLE = 'gameobject_quest_finisher';
export const GAMEOBJECT_QUESTENDER_ID = 'quest';
export const GAMEOBJECT_QUESTENDER_ID_2 = 'entry';

export class GameobjectQuestender extends TableRow {
  entry: number = 0;
  quest: number = 0;
}
