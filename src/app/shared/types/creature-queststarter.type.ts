import { TableRow } from './general';

export const CREATURE_QUESTSTARTER_TABLE = 'creature_quest_starter';
export const CREATURE_QUESTSTARTER_ID = 'quest';
export const CREATURE_QUESTSTARTER_ID_2 = 'entry';

export class CreatureQueststarter extends TableRow {
  entry: number = 0;
  quest: number = 0;
}
