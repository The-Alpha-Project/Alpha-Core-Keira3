import { TableRow } from './general';

export const CREATURE_EQUIP_TEMPLATE_TABLE = 'creature_equip_template';
export const CREATURE_EQUIP_TEMPLATE_ID = 'entry';

export class CreatureEquipTemplate extends TableRow {
  entry: number = 0;
  equipentry1: number = 0;
  equipentry2: number = 0;
  equipentry3: number = 0;
}
