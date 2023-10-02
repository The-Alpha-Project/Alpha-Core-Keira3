import { TableRow } from './general';

export const CREATURE_QUESTENDER_TABLE = 'creature_quest_finisher';
export const CREATURE_QUESTENDER_ID = 'quest';
export const CREATURE_QUESTENDER_ID_2 = 'entry';

export class CreatureQuestender extends TableRow {
  entry: number = 0;
  quest: number = 0;
}
