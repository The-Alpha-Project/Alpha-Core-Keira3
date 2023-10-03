import { TableRow } from './general';

export const GAMEOBJECT_TEMPLATE_TABLE = 'gameobject_template';
export const GAMEOBJECT_TEMPLATE_ID = 'entry';
export const GAMEOBJECT_TEMPLATE_NAME = 'name';
export const GAMEOBJECT_TEMPLATE_CUSTOM_STARTING_ID = 900_000;
export const GAMEOBJECT_TEMPLATE_SEARCH_FIELDS = [GAMEOBJECT_TEMPLATE_ID, GAMEOBJECT_TEMPLATE_NAME, 'script_name'];

export const GAMEOBJECT_TEMPLATE_LOOT_ID = 'data1';
export const GAMEOBJECT_TEMPLATE_TYPE = 'type';

export class GameobjectTemplate extends TableRow {
  entry: number = 0;
  type: number = 0;
  displayId: number = 0;
  name: string = '';
  faction: number = 0;
  flags: number = 0;
  size: number = 1;
  data0: number = 0;
  data1: number = 0;
  data2: number = 0;
  data3: number = 0;
  data4: number = 0;
  data5: number = 0;
  data6: number = 0;
  data7: number = 0;
  data8: number = 0;
  data9: number = 0;
  mingold: number = 0;
  maxgold: number = 0;
  script_name: string = '';
}
