import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MysqlQueryService } from '@keira-shared/services/mysql-query.service';
import { TranslateTestingModule } from '@keira-shared/testing/translate-module';
import { EditorPageObject } from '@keira-testing/editor-page-object';
import { GameobjectTemplate } from '@keira-types/gameobject-template.type';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { GameobjectHandlerService } from '../gameobject-handler.service';
import { SaiGameobjectHandlerService } from '../sai-gameobject-handler.service';
import { GameobjectTemplateComponent } from './gameobject-template.component';
import { GameobjectTemplateModule } from './gameobject-template.module';
import Spy = jasmine.Spy;

class GameobjectTemplatePage extends EditorPageObject<GameobjectTemplateComponent> {}

describe('GameobjectTemplate integration tests', () => {
  let fixture: ComponentFixture<GameobjectTemplateComponent>;
  let queryService: MysqlQueryService;
  let querySpy: Spy;
  let handlerService: GameobjectHandlerService;
  let page: GameobjectTemplatePage;

  const id = 1234;
  const expectedFullCreateQuery =
    'DELETE FROM `gameobject_template` WHERE (`entry` = ' +
    id +
    ');\n' +
    'INSERT INTO `gameobject_template` (`entry`, `type`, `displayId`, `name`, `faction`, `flags`, `size`, `data0`, `data1`, `data2`, `data3`, `data4` ' +
    '`data5`, `data6`, `data7`, `data8`, `data9`, `mingold`, `maxgold`, `script_name`, ' +
    '(' +
    id +
    ", 38, 2, 10, 'Captain Sanders Chest', 0, 4, 1, 0, 2882, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, ''";

  const originalEntity = new GameobjectTemplate();
  originalEntity.entry = id;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot(),
        ModalModule.forRoot(),
        GameobjectTemplateModule,
        RouterTestingModule,
        TranslateTestingModule,
        HttpClientTestingModule,
      ],
      providers: [GameobjectHandlerService, SaiGameobjectHandlerService],
    }).compileComponents();
  }));

  function setup(creatingNew: boolean) {
    handlerService = TestBed.inject(GameobjectHandlerService);
    handlerService['_selected'] = `${id}`;
    handlerService.isNew = creatingNew;

    queryService = TestBed.inject(MysqlQueryService);
    querySpy = spyOn(queryService, 'query').and.returnValue(of([]));

    spyOn(queryService, 'selectAll').and.returnValue(of(creatingNew ? [] : [originalEntity]));

    fixture = TestBed.createComponent(GameobjectTemplateComponent);
    page = new GameobjectTemplatePage(fixture);
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
      const field = 'Data0';
      expect(handlerService.isGameobjectTemplateUnsaved).toBe(false);
      page.setInputValueById(field, 3);
      expect(handlerService.isGameobjectTemplateUnsaved).toBe(true);
      page.setInputValueById(field, 0);
      expect(handlerService.isGameobjectTemplateUnsaved).toBe(false);
    });

    it('changing a property and executing the query should correctly work', () => {
      const expectedQuery =
        'DELETE FROM `gameobject_template` WHERE (`entry` = ' +
        id +
        ');\n' +
        'INSERT INTO `gameobject_template` (`entry`, `type`, `displayId`, `name`, `faction`, `flags`, `size`, `data0`, `data1`, `data2`, `data3`, `data4` ' +
        '`data5`, `data6`, `data7`, `data8`, `data9`, `mingold`, `maxgold`, `script_name`, ' +
        '(' +
        id +
        ", 38, 2, 10, 'Helias', 0, 4, 1, 0, 2882, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, ''";

      querySpy.calls.reset();

      page.setInputValueById('name', 'Helias');
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
      const expectedQuery =
        "UPDATE `gameobject_template` SET `type` = 1, `displayId` = 110, `name` = 'Captain Sanders Chest1', `faction` = 1, `flags` = 41, `size` = 11, `data0` = 1, `data1` = 28821, `data2` = 1, `data3` = 1401, `data4` = 1, `data5` = 1, `data6` = 1, `data7` = 1, `data8` = 1, `data9` = 1, `mingold` = 1, `maxgold` = 1, `script_name` = '1' WHERE (`entry` = 1234);";

      querySpy.calls.reset();

      page.changeAllFields(originalEntity);
      page.expectDiffQueryToContain(expectedQuery);

      page.clickExecuteQuery();
      expect(querySpy).toHaveBeenCalledTimes(1);
      expect(querySpy.calls.mostRecent().args[0]).toContain(expectedQuery);
    });

    it('changing values should correctly update the queries', () => {
      // Note: full query check has been shortened here because the table is too big, don't do this in other tests unless necessary

      page.setInputValueById('name', 'Helias');
      page.expectDiffQueryToContain("UPDATE `gameobject_template` SET `name` = 'Helias' WHERE (`entry` = " + id + ');');
      page.expectFullQueryToContain('Helias');

      page.setInputValueById('data0', '35');
      page.expectDiffQueryToContain("UPDATE `gameobject_template` SET `name` = 'Helias', `data0` = 35 WHERE (`entry` = " + id + ');');
      page.expectFullQueryToContain('Helias');
      page.expectFullQueryToContain('35');
    });

    xit('changing a value via SingleValueSelector should correctly work', waitForAsync(async () => {
      const field = 'type';
      page.clickElement(page.getSelectorBtn(field));
      await page.whenReady();
      page.expectModalDisplayed();

      page.clickRowOfDatatableInModal(7);
      await page.whenReady();
      page.clickModalSelect();
      await page.whenReady();

      expect(page.getInputById(field).value).toEqual('7');
      page.expectDiffQueryToContain('UPDATE `gameobject_template` SET `type` = 7 WHERE (`entry` = ' + id + ');');
      page.expectFullQueryToContain(
        'DELETE FROM `gameobject_template` WHERE (`entry` = ' +
          id +
          ');\n' +
          'INSERT INTO `gameobject_template` (`entry`, `type`, `displayId`, `name`, `faction`, `flags`, `size`, `data0`, `data1`, `data2`, `data3`, `data4` ' +
          '`data5`, `data6`, `data7`, `data8`, `data9`, `mingold`, `maxgold`, `script_name`, ' +
          '(' +
          id +
          ", 38, 2, 10, 'Helias', 0, 4, 1, 0, 2882, 0, 140, 0, 0, 0, 0, 0, 0, 0, 0, ''",
      );
    }));
  });
});
