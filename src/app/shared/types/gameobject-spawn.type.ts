import { TableRow } from './general';

export const GAMEOBJECT_SPAWN_TABLE = 'spawns_gameobjects';
export const GAMEOBJECT_SPAWN_ID = 'spawn_entry';
export const GAMEOBJECT_SPAWN_ID_2 = 'spawn_id';

export class GameobjectSpawn extends TableRow {
  spawn_id: number = 0;
  spawn_entry: number = 0;
  spawn_map: number = 0;
  spawn_positionX: number = 0;
  spawn_positionY: number = 0;
  spawn_positionZ: number = 0;
  spawn_orientation: number = 0;
  spawn_rotation0: number = 0;
  spawn_rotation1: number = 0;
  spawn_rotation2: number = 0;
  spawn_rotation3: number = 0;
  spawn_spawntimemin: number = 0;
  spawn_spawntimemax: number = 0;
  spawn_animprogress: number = 0;
  spawn_state: number = 0;
  spawn_flags: number = 0;
  spawn_visibility_mod: number = 0;
  ignored: number = 0;
}
