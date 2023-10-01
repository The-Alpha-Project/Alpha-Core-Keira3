import { TableRow } from './general';

export const CREATURE_ADDON_TABLE = 'creature_addon';
export const CREATURE_ADDON_ID = 'entry';

export class CreatureAddon extends TableRow {
  guid: number = 0;
  display_id: number = 0;
  mount_display_id: number = 0;
  equipment_id: number = 0;
  stand_state: number = 0;
  sheath_state: number = 0;
  emote_state: number = 0;
  auras: string = '[NULL]';
}
