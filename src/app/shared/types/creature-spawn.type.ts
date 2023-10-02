import { TableRow } from './general';

export const CREATURE_SPAWN_TABLE = 'spawns_creatures';
export const CREATURE_SPAWN_ID = 'spawn_entry1';
export const CREATURE_SPAWN_ID_2 = 'spawn_id';

export class CreatureSpawn extends TableRow {
  spawn_id: number = 0;
  spawn_entry1: number = 0;
  spawn_entry2: number = 0;
  spawn_entry3: number = 0;
  spawn_entry4: number = 0;
  map: number = 0;
  position_x: number = 0;
  position_y: number = 0;
  position_z: number = 0;
  orientation: number = 0;
  spawntimesecsmin: number = 300;
  spawntimesecsmax: number = 300;
  wander_distance: number = 0;
  health_percent: number = 1;
  mana_percent: number = 0;
  movement_type: number = 0;
  spawn_flags: number = 0;
  visibility_mod: number = 0;
  ignored: number = 0;
}
