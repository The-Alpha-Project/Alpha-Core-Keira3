import { TableRow } from './general';

export const GOSSIP_MENU_TABLE = 'gossip_menu';
export const GOSSIP_MENU_ID = 'entry';
export const GOSSIP_MENU_ID_2 = 'text_id';
export const GOSSIP_MENU_SEARCH_FIELDS = [GOSSIP_MENU_ID, GOSSIP_MENU_ID_2];
export const GOSSIP_MENU_CUSTOM_STARTING_ID = 62_000;

export class GossipMenu extends TableRow {
  entry: number = 0;
  text_id: number = 0;
  script_id: number = 0;
  condition_id: number = 0;
}
