import { Injectable } from '@angular/core';
import { EditorService } from '@keira-shared/abstract/service/editors/editor.service';
import { QUEST_FLAG_SHARABLE } from '@keira-shared/constants/flags/quest-flags';
import { QUEST_INFO } from '@keira-shared/constants/options/quest-info';
import { CLASSES_TEXT, RACES_TEXT } from '@keira-shared/constants/preview';
import {
  ICON_SKILLS,
  QUEST_FLAG_DAILY,
  QUEST_FLAG_REPEATABLE,
  QUEST_FLAG_SPECIAL_MONTHLY,
  QUEST_FLAG_SPECIAL_REPEATABLE,
  QUEST_FLAG_WEEKLY,
  QUEST_PERIOD,
} from '@keira-shared/constants/quest-preview';
import { MysqlQueryService } from '@keira-shared/services/mysql-query.service';
import { PreviewHelperService } from '@keira-shared/services/preview-helper.service';
import { SqliteQueryService } from '@keira-shared/services/sqlite-query.service';
import { CreatureQuestender } from '@keira-shared/types/creature-questender.type';
import { CreatureQueststarter } from '@keira-shared/types/creature-queststarter.type';
import { GameobjectQuestender } from '@keira-shared/types/gameobject-questender.type';
import { GameobjectQueststarter } from '@keira-shared/types/gameobject-queststarter.type';
import { QuestTemplate } from '@keira-shared/types/quest-template.type';
import { TableRow } from '@keira-types/general';
import { QuestOfferReward } from '@keira-types/quest-offer-reward.type';
import { QuestRequestItems } from '@keira-types/quest-request-items.type';
import { QuestTemplateAddon } from '@keira-types/quest-template-addon.type';
import { CreatureQuestenderService } from '../creature-questender/creature-questender.service';
import { CreatureQueststarterService } from '../creature-queststarter/creature-queststarter.service';
import { GameobjectQuestenderService } from '../gameobject-questender/gameobject-questender.service';
import { GameobjectQueststarterService } from '../gameobject-queststarter/gameobject-queststarter.service';
import { QuestHandlerService } from '../quest-handler.service';
import { QuestOfferRewardService } from '../quest-offer-reward/quest-offer-reward.service';
import { QuestRequestItemsService } from '../quest-request-items/quest-request-items.service';
import { QuestTemplateAddonService } from '../quest-template-addon/quest-template-addon.service';
import { QuestTemplateService } from '../quest-template/quest-template.service';
import { DifficultyLevel, Quest, QuestReputationReward } from './quest-preview.model';

@Injectable()
export class QuestPreviewService {
  showPreview = true;

  private prevSerieCache: Promise<Quest[]>[] = [];
  private nextSerieCache: Promise<Quest[]>[] = [];
  private nextSerieUsingPrevCache: Promise<Quest[]>[] = [];

  constructor(
    private readonly helperService: PreviewHelperService,
    readonly mysqlQueryService: MysqlQueryService,
    readonly sqliteQueryService: SqliteQueryService,
    private readonly questHandlerService: QuestHandlerService,
    private readonly questTemplateService: QuestTemplateService,
    private readonly questRequestItemsService: QuestRequestItemsService,
    private readonly questTemplateAddonService: QuestTemplateAddonService,
    private readonly questOfferRewardService: QuestOfferRewardService,
    private readonly gameobjectQueststarterService: GameobjectQueststarterService,
    private readonly gameobjectQuestenderService: GameobjectQuestenderService,
    private readonly creatureQueststarterService: CreatureQueststarterService,
    private readonly creatureQuestenderService: CreatureQuestenderService,
  ) {}

  readonly RACES_TEXT = RACES_TEXT;
  readonly CLASSES_TEXT = CLASSES_TEXT;
  readonly QUEST_INFO = QUEST_INFO;
  readonly ICON_SKILLS = ICON_SKILLS;

  // get form value
  get questTemplate(): QuestTemplate {
    return this.questTemplateService.form.getRawValue();
  }
  get questTemplateAddon(): QuestTemplateAddon {
    return this.questTemplateAddonService.form.getRawValue();
  }
  get questOfferReward(): QuestOfferReward {
    return this.questOfferRewardService.form.getRawValue();
  }
  get questRequestItems(): QuestRequestItems {
    return this.questRequestItemsService.form.getRawValue();
  }
  get creatureQueststarterList(): CreatureQueststarter[] {
    return this.creatureQueststarterService.newRows;
  }
  get creatureQuestenderList(): CreatureQuestender[] {
    return this.creatureQuestenderService.newRows;
  }
  get gameobjectQueststarterList(): GameobjectQueststarter[] {
    return this.gameobjectQueststarterService.newRows;
  }
  get gameobjectQuestenderList(): GameobjectQuestender[] {
    return this.gameobjectQuestenderService.newRows;
  }

  // get QuestTemplate values
  get id(): number {
    return this.questTemplate.entry;
  }
  get title(): string {
    return this.questTemplate.Title;
  }
  get level(): string {
    return String(this.questTemplate.QuestLevel);
  }
  get minLevel(): string {
    return String(this.questTemplate.MinLevel);
  }
  get side(): string {
    return this.helperService.getFactionFromRace(this.questTemplate.RequiredRaces);
  }
  get races(): number[] {
    return this.helperService.getRaceString(this.questTemplate.RequiredRaces);
  }
  get sharable(): string {
    return this.questTemplate.QuestFlags & QUEST_FLAG_SHARABLE ? 'Sharable' : 'Not sharable';
  }
  get startItem(): number {
    return this.questTemplate.SrcItemId;
  }
  get startItemName$(): Promise<string> {
    return this.mysqlQueryService.getItemNameById(this.startItem);
  }
  get objectiveText(): string {
    return this.questTemplate.Objectives;
  }
  get rewardMoney(): number {
    return this.questTemplate.RewOrReqMoney;
  }
  get rewardBonusMoney(): number {
    return this.questTemplate.RewMailMoney;
  }

  // get QuestTemplateAddon values
  get maxLevel(): string {
    return String(this.questTemplate.level_max);
  }
  get classes(): number[] {
    return this.helperService.getRequiredClass(this.questTemplate.RequiredRaces);
  }

  // Item Quest Starter
  get questGivenByItem$(): Promise<string> {
    return this.mysqlQueryService.getItemByStartQuest(this.questTemplate.entry);
  }
  get questStarterItem$(): Promise<string> {
    return this.mysqlQueryService.getItemNameByStartQuest(this.questTemplate.entry);
  }

  // Quest Serie & relations
  get prevQuestList$(): Promise<Quest[]> {
    return this.getPrevQuestListCached();
  }
  get nextQuestList$(): Promise<Quest[]> {
    return this.getNextQuestListCached();
  }
  get enabledByQuestId(): number {
    return this.getEnabledByQuestId();
  }
  get enabledByQuestTitle$(): Promise<string> {
    return this.getEnabledByQuestName();
  }

  get difficultyLevels(): DifficultyLevel {
    return this.getDifficultyLevels();
  }

  initializeServices() {
    this.initService(this.questTemplateService);
    // this.initService(this.questRequestItemsService);
    // this.initService(this.questOfferRewardService);
    // this.initService(this.questTemplateAddonService);
    this.initService(this.gameobjectQueststarterService);
    this.initService(this.gameobjectQuestenderService);
    this.initService(this.creatureQueststarterService);
    this.initService(this.creatureQuestenderService);
  }

  private initService<T extends TableRow>(service: EditorService<T>) {
    if (!!this.questHandlerService.selected && service.loadedEntityId !== this.questHandlerService.selected) {
      service.reload(this.questHandlerService.selected);
    }
  }

  private getDifficultyLevels(): DifficultyLevel {
    if (this.questTemplate.QuestLevel > 0) {
      const levels: DifficultyLevel = {};

      // red
      if (this.questTemplate.MinLevel && this.questTemplate.MinLevel < this.questTemplate.QuestLevel - 4) {
        levels.red = this.questTemplate.MinLevel;
      }

      // orange
      if (!this.questTemplate.MinLevel || this.questTemplate.MinLevel < this.questTemplate.QuestLevel - 2) {
        levels.orange =
          Object.keys(levels).length === 0 && this.questTemplate.MinLevel > this.questTemplate.QuestLevel - 4
            ? this.questTemplate.MinLevel
            : this.questTemplate.QuestLevel - 4;
      }

      // yellow
      levels.yellow =
        Object.keys(levels).length === 0 && this.questTemplate.MinLevel > this.questTemplate.QuestLevel - 2
          ? this.questTemplate.MinLevel
          : this.questTemplate.QuestLevel - 2;

      // green
      levels.green = this.questTemplate.QuestLevel + 3;

      // grey (is about +/-1 level off)
      levels.grey = this.questTemplate.QuestLevel + 3 + Math.ceil((12 * this.questTemplate.QuestLevel) / 80);

      return levels;
    }

    return null;
  }

  get periodicQuest(): string {
    return this.getPeriodicQuest();
  }

  private getPeriodicQuest(): QUEST_PERIOD {
    const flags = this.questTemplate.QuestFlags;
    const specialFlags = this.questTemplate.SpecialFlags;

    if (flags & QUEST_FLAG_DAILY) {
      return QUEST_PERIOD.DAILY;
    }

    if (flags & QUEST_FLAG_WEEKLY) {
      return QUEST_PERIOD.WEEKLY;
    }

    if (specialFlags & QUEST_FLAG_SPECIAL_MONTHLY) {
      return QUEST_PERIOD.MONTHLY;
    }

    return null;
  }

  private async getPrevQuestList(prev: number): Promise<Quest[]> {
    const array: Quest[] = [];

    while (!!prev && prev > 0) {
      // when < 0 it's "enabled by"
      array.push({
        entry: prev,
        title: await this.mysqlQueryService.getQuestTitleById(prev),
      });

      prev = Number(await this.mysqlQueryService.getPrevQuestById(prev));
    }

    return array.reverse();
  }

  private getPrevQuestListCached(): Promise<Quest[]> {
    const id = this.questTemplate.PrevQuestId;

    if (!this.prevSerieCache[id]) {
      this.prevSerieCache[id] = this.getPrevQuestList(id);
    }

    return this.prevSerieCache[id];
  }

  private async getNextQuestListUsingNext(next: number): Promise<Quest[]> {
    const array: Quest[] = [];

    while (!!next) {
      array.push({
        entry: next,
        title: await this.mysqlQueryService.getQuestTitleById(next),
      });

      next = Number(await this.mysqlQueryService.getNextQuestById(next));
    }

    return array;
  }

  private async getNextQuestListUsingPrev(current: number): Promise<Quest[]> {
    const array: Quest[] = [];

    while (!!current) {
      const next = Number(await this.mysqlQueryService.getNextQuestById(current, true));

      if (!!next) {
        array.push({
          entry: next,
          title: await this.mysqlQueryService.getQuestTitleById(next),
        });
      }

      current = next;
    }

    return array;
  }

  private getNextQuestListCached(): Promise<Quest[]> {
    const next = this.questTemplate.NextQuestId;

    if (!!next) {
      // if a NextQuestId is specified, we calculate the chain using that

      if (!this.nextSerieCache[next]) {
        this.nextSerieCache[next] = this.getNextQuestListUsingNext(next);
      }

      return this.nextSerieCache[next];
    }

    // otherwise, we calculate the chain using the PrevQuestId of the next
    const id = this.id;
    if (!this.nextSerieUsingPrevCache[id]) {
      this.nextSerieUsingPrevCache[id] = this.getNextQuestListUsingPrev(id);
    }

    return this.nextSerieUsingPrevCache[id];
  }

  private getEnabledByQuestId(): number {
    return this.questTemplate.PrevQuestId < 0 ? -this.questTemplate.PrevQuestId : 0;
  }

  private getEnabledByQuestName(): Promise<string> {
    return this.mysqlQueryService.getQuestTitleById(this.getEnabledByQuestId());
  }

  public isUnavailable(): boolean {
    const UNAVAILABLE = 0x04000;
    return (this.questTemplate.QuestFlags & UNAVAILABLE) === UNAVAILABLE;
  }

  public isRepeatable(): boolean {
    return !!(this.questTemplate.QuestFlags & QUEST_FLAG_REPEATABLE || this.questTemplate.SpecialFlags & QUEST_FLAG_SPECIAL_REPEATABLE);
  }

  get requiredSkill$(): Promise<string> {
    return this.sqliteQueryService.getSkillNameById(Number(this.questTemplate.RequiredSkill));
  }

  get rewXP(): number {
    return this.questTemplate.RewXP;
  }

  getRepReward$(field: number | string): Promise<QuestReputationReward[]> {
    return this.mysqlQueryService.getReputationRewardByFaction(this.questTemplate[`RewRepFaction${field}`]);
  }

  getRewardReputation(field: string | number, reputationReward: QuestReputationReward[]): number {
    const faction = this.questTemplate[`RewRepFaction${field}`];
    const value = this.questTemplate[`RewRepValue${field}`];

    if (!faction || !value) {
      return null;
    }

    if (!!reputationReward && !!reputationReward[0]) {
      const dailyType = this.getPeriodicQuest();

      if (!!dailyType) {
        if (dailyType === QUEST_PERIOD.DAILY && reputationReward[0].quest_daily_rate !== 1) {
          return Number(value) * (reputationReward[0].quest_daily_rate - 1);
        }

        if (dailyType === QUEST_PERIOD.WEEKLY && reputationReward[0].quest_weekly_rate !== 1) {
          return Number(value) * (reputationReward[0].quest_weekly_rate - 1);
        }

        if (dailyType === QUEST_PERIOD.MONTHLY && reputationReward[0].quest_monthly_rate !== 1) {
          return Number(value) * (reputationReward[0].quest_monthly_rate - 1);
        }
      }

      if (this.isRepeatable() && reputationReward[0].quest_repeatable_rate !== 1) {
        return Number(value) * (reputationReward[0].quest_repeatable_rate - 1);
      }

      if (reputationReward[0].quest_rate !== 1) {
        return Number(value) * (reputationReward[0].quest_rate - 1);
      }
    }

    return Number(value);
  }

  getObjText(field: string | number) {
    return this.questTemplate[`ObjectiveText${field}`];
  }

  getObjective$(field: string | number): Promise<string> {
    const RequiredNpcOrGo = Number(this.questTemplate[`ReqCreatureOrGOId${field}`]);
    if (!!RequiredNpcOrGo) {
      if (RequiredNpcOrGo > 0) {
        return this.mysqlQueryService.getCreatureNameById(RequiredNpcOrGo);
      }

      return this.mysqlQueryService.getGameObjectNameById(Math.abs(RequiredNpcOrGo));
    }
  }

  getObjectiveCount(field: string | number): string {
    const reqNpcOrGo = this.questTemplate[`ReqCreatureOrGOCount${field}`];
    return !!reqNpcOrGo && reqNpcOrGo > 1 ? `(${reqNpcOrGo})` : '';
  }

  isNpcOrGoObj(field: string | number): boolean {
    return !!this.questTemplate[`ReqCreatureOrGOCount${field}`];
    // return !!this.questTemplate[`ObjectiveText${field}`] || !!this.questTemplate[`RequiredNpcOrGo${field}`];
  }

  getObjItemCount(field: string | number) {
    const reqItemCount = this.questTemplate[`ReqItemCount${field}`];
    return !!reqItemCount && reqItemCount > 1 ? `(${reqItemCount})` : '';
  }

  getFactionByValue(field: string | number) {
    switch (Number(this.questTemplate[`RequiredFactionValue${field}`])) {
      case 900:
      case 2100:
        return '(Neutral)';
      case 3000:
        return '(Friendly)';
      case 9000:
        return '(Honored)';
      case 21000:
        return '(Revered)';
      case 42000:
        return '(Exalted)';
      default:
        return '';
    }
  }

  isFieldAvailable(field: string, fieldAmount: string, idx: string | number): boolean {
    return !!this.questTemplate[`${field}${idx}`] && this.questTemplate[`${fieldAmount}${idx}`] > 0;
  }

  isRewardReputation(): boolean {
    return (
      this.isFieldAvailable('RewRepFaction', 'RewRepValue', 1) ||
      this.isFieldAvailable('RewRepFaction', 'RewRepValue', 2) ||
      this.isFieldAvailable('RewRepFaction', 'RewRepValue', 3) ||
      this.isFieldAvailable('RewRepFaction', 'RewRepValue', 4) ||
      this.isFieldAvailable('RewRepFaction', 'RewRepValue', 5)
    );
  }

  isGains(): boolean {
    return !!this.questTemplate.RewXP || !!this.questTemplate.RewSpell || this.isRewardReputation();
  }

  isRewardItems(): boolean {
    return (
      this.isFieldAvailable('RewItemId', 'RewItemCount', 1) ||
      this.isFieldAvailable('RewItemId', 'RewItemCount', 2) ||
      this.isFieldAvailable('RewItemId', 'RewItemCount', 3) ||
      this.isFieldAvailable('RewItemId', 'RewItemCount', 4)
    );
  }

  isRewardChoiceItems(): boolean {
    return (
      this.isFieldAvailable('RewChoiceItemId', 'RewChoiceItemCount', 1) ||
      this.isFieldAvailable('RewChoiceItemId', 'RewChoiceItemCount', 2) ||
      this.isFieldAvailable('RewChoiceItemId', 'RewChoiceItemCount', 3) ||
      this.isFieldAvailable('RewChoiceItemId', 'RewChoiceItemCount', 4) ||
      this.isFieldAvailable('RewChoiceItemId', 'RewChoiceItemCount', 5) ||
      this.isFieldAvailable('RewChoiceItemId', 'RewChoiceItemCount', 6)
    );
  }

  isRewardMoney(): boolean {
    return this.rewardMoney > 0;
  }

  isRewardBonusMoney(): boolean {
    return this.rewardBonusMoney > 0;
  }

  isReward(): boolean {
    return this.isRewardItems() || this.isRewardChoiceItems() || !!this.rewardSpell() || this.isRewardMoney() || this.isRewardBonusMoney();
  }

  rewardSpell(): number {
    if (!!this.questTemplate.RewardDisplaySpell) {
      return 0;
      // return this.questTemplate.RewardDisplaySpell;
    }

    if (!!this.questTemplate.RewardSpell) {
      return 0;
      // return this.questTemplate.RewardSpell;
    }

    return null;
  }
}
