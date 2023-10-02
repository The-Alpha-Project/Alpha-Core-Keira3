import { TableRow } from './general';

export const LOOT_TEMPLATE_ID = 'entry';
export const LOOT_TEMPLATE_ID_2 = 'item';

export class LootTemplate extends TableRow {
  entry: number = 0;
  item: number = 0;
  ChanceOrQuestChance: number = 0.02;
  groupid: number = 0;
  mincountOrRef: number = 1;
  maxcount: number = 1;
  condition_id: number = 1;
}
