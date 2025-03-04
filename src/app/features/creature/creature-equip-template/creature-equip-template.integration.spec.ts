import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MysqlQueryService } from '@keira-shared/services/mysql-query.service';
import { EditorPageObject } from '@keira-testing/editor-page-object';
import { CreatureEquipTemplate } from '@keira-types/creature-equip-template.type';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { CreatureHandlerService } from '../creature-handler.service';
import { SaiCreatureHandlerService } from '../sai-creature-handler.service';
import { CreatureEquipTemplateComponent } from './creature-equip-template.component';
import { CreatureEquipTemplateModule } from './creature-equip-template.module';
import { TranslateTestingModule } from '@keira-shared/testing/translate-module';
import Spy = jasmine.Spy;

class CreatureEquipTemplatePage extends EditorPageObject<CreatureEquipTemplateComponent> {}

describe('CreatureEquipTemplate integration tests', () => {
  let fixture: ComponentFixture<CreatureEquipTemplateComponent>;
  let queryService: MysqlQueryService;
  let querySpy: Spy;
  let handlerService: CreatureHandlerService;
  let page: CreatureEquipTemplatePage;

  const id = 1234;
  const expectedFullCreateQuery =
    'DELETE FROM `creature_equip_template` WHERE (`entry` = 1234);\n' +
    'INSERT INTO `creature_equip_template` (`entry`, `equipentry1`, `equipentry2`, `equipentry3`) VALUES\n' +
    '(1234, 0, 0, 0);';

  const originalEntity = new CreatureEquipTemplate();
  originalEntity.entry = id;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot(), ModalModule.forRoot(), CreatureEquipTemplateModule, RouterTestingModule, TranslateTestingModule],
      providers: [CreatureHandlerService, SaiCreatureHandlerService],
    }).compileComponents();
  }));

  function setup(creatingNew: boolean) {
    handlerService = TestBed.inject(CreatureHandlerService);
    handlerService['_selected'] = `${id}`;
    handlerService.isNew = creatingNew;

    queryService = TestBed.inject(MysqlQueryService);
    querySpy = spyOn(queryService, 'query').and.returnValue(of([]));
    spyOn(queryService, 'queryValue').and.returnValue(of());

    spyOn(queryService, 'selectAll').and.returnValue(of(creatingNew ? [] : [originalEntity]));

    fixture = TestBed.createComponent(CreatureEquipTemplateComponent);
    page = new CreatureEquipTemplatePage(fixture);
    fixture.autoDetectChanges(true);
    fixture.detectChanges();
  }

  describe('Creating new', () => {
    beforeEach(() => setup(true));

    it('should correctly initialise', () => {
      page.expectQuerySwitchToBeHidden();
      page.expectFullQueryToBeShown();
      page.expectFullQueryToContain(expectedFullCreateQuery);
    });

    it('should correctly update the unsaved status', () => {
      const field = 'equipentry1';
      expect(handlerService.isCreatureEquipTemplateUnsaved).toBe(false);
      page.setInputValueById(field, 3);
      expect(handlerService.isCreatureEquipTemplateUnsaved).toBe(true);
      page.setInputValueById(field, 0);
      expect(handlerService.isCreatureEquipTemplateUnsaved).toBe(false);
    });

    it('changing a property and executing the query should correctly work', () => {
      const expectedQuery =
        'DELETE FROM `creature_equip_template` WHERE (`entry` = 1234);\n' +
        'INSERT INTO `creature_equip_template` (`entry`, `equipentry1`, `equipentry2`, `equipentry3`) VALUES\n' +
        '(1234, 0, 2, 0);';
      querySpy.calls.reset();

      page.setInputValueById('equipentry2', '2');
      page.expectFullQueryToContain(expectedQuery);

      page.clickExecuteQuery();

      expect(querySpy).toHaveBeenCalledTimes(1);
      expect(querySpy.calls.mostRecent().args[0]).toContain(expectedQuery);
    });
  });

  describe('Editing existing', () => {
    beforeEach(() => setup(false));

    it('should correctly initialise', () => {
      page.expectDiffQueryToBeShown();
      page.expectDiffQueryToBeEmpty();
      page.expectFullQueryToContain(expectedFullCreateQuery);
    });

    it('changing all properties and executing the query should correctly work', () => {
      const expectedQuery = 'UPDATE `creature_equip_template` SET `equipentry2` = 1, `equipentry3` = 2 WHERE (`entry` = 1234);';
      querySpy.calls.reset();

      page.changeAllFields(originalEntity);
      page.expectDiffQueryToContain(expectedQuery);

      page.clickExecuteQuery();
      expect(querySpy).toHaveBeenCalledTimes(1);
      expect(querySpy.calls.mostRecent().args[0]).toContain(expectedQuery);
    });

    it('changing values should correctly update the queries', () => {
      page.setInputValueById('equipentry1', '1');
      page.expectDiffQueryToContain('UPDATE `creature_equip_template` SET `equipentry1` = 1 WHERE (`entry` = 1234);');
      page.expectFullQueryToContain(
        'DELETE FROM `creature_equip_template` WHERE (`entry` = 1234);\n' +
          'INSERT INTO `creature_equip_template` (`entry`, `equipentry1`, `equipentry2`, `equipentry3`) VALUES\n' +
          '(1234, 1, 0, 0);',
      );

      page.setInputValueById('equipentry3', '3');
      page.expectDiffQueryToContain('UPDATE `creature_equip_template` SET `equipentry1` = 1, `equipentry3` = 3 WHERE (`entry` = 1234);');
      page.expectFullQueryToContain(
        'DELETE FROM `creature_equip_template` WHERE (`entry` = 1234);\n' +
          'INSERT INTO `creature_equip_template` (`entry`, `equipentry1`, `equipentry2`, `equipentry3`) VALUES\n' +
          '(1234, 1, 0, 3);',
      );
    });

    xit('changing a value via ItemSelector should correctly work', waitForAsync(async () => {
      //  note: previously disabled because of:
      //  https://stackoverflow.com/questions/57336982/how-to-make-angular-tests-wait-for-previous-async-operation-to-complete-before-e

      const itemEntry = 1200;
      querySpy.and.returnValue(of([{ entry: itemEntry, name: 'Mock Item' }]));
      const field = 'equipentry1';
      page.clickElement(page.getSelectorBtn(field));
      page.expectModalDisplayed();
      await page.whenReady();

      page.clickSearchBtn();
      await page.whenReady();
      page.clickRowOfDatatableInModal(0);
      await page.whenReady();
      page.clickModalSelect();
      await page.whenReady();

      page.expectDiffQueryToContain('UPDATE `creature_equip_template` SET `equipentry1` = 1200 WHERE (`entry` = 1234);');
      page.expectFullQueryToContain(
        'DELETE FROM `creature_equip_template` WHERE (`entry` = 1234);\n' +
          'INSERT INTO `creature_equip_template` (`entry`, `ID`, `equipentry1`, `equipentry2`, `equipentry3`) VALUES\n' +
          '(1234, 1200, 0, 0);',
      );
    }));
  });
});
