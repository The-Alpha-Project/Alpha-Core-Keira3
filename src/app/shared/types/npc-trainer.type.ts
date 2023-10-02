import { TableRow } from './general';

export const NPC_TRAINER_TABLE = 'trainer_template';
export const NPC_TRAINER_ID = 'template_entry';
export const NPC_TRAINER_ID_2 = 'spell';

export class NpcTrainer extends TableRow {
  template_entry: number = 0;
  spell: number = 0;
  playerspell: number = 0;
  spellcost: number = 0;
  talentpointcost: number = 0;
  skillpointcost: number = 0;
  reqskill: number = 0;
  reqskillvalue: number = 0;
  reqlevel: number = 0;
}
