import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MysqlService } from '@keira-shared/services/mysql.service';
import { TranslateTestingModule } from '@keira-shared/testing/translate-module';
import { MockedMysqlQueryService } from '@keira-testing/mocks';
import { PageObject } from '@keira-testing/page-object';
import { VersionDbRow, VersionRow } from '@keira-types/general';
import { of, throwError } from 'rxjs';
import { anyString, instance, when } from 'ts-mockito';
import { MysqlQueryService } from '../../shared/services/mysql-query.service';
import { DashboardComponent } from './dashboard.component';
import { DashboardModule } from './dashboard.module';

class DashboardComponentPage extends PageObject<DashboardComponent> {
  get coreVersion(): HTMLTableCellElement {
    return this.query<HTMLTableCellElement>('#core-version');
  }
  get coreRevision(): HTMLTableCellElement {
    return this.query<HTMLTableCellElement>('#core-revision');
  }
  get dbVersion(): HTMLTableCellElement {
    return this.query<HTMLTableCellElement>('#db-version');
  }
  get dbWorldVersion(): HTMLTableCellElement {
    return this.query<HTMLTableCellElement>('#db-world-version');
  }
  get dbWarning(): HTMLDivElement {
    return this.query<HTMLDivElement>('#database-warning', false);
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let page: DashboardComponentPage;

  const versionRow: VersionRow = {
    core_version: 'AzerothCore rev. 2bcedc2859e7 2019-02-17 10:04:09 +0100 (master branch) (Unix, Debug)',
    core_revision: '2bcedc2859e7',
    db_version: 'ACDB 335.3 (dev)',
    cache_id: 3,
  };
  const worldDbVersion = '2019_02_17_02';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DashboardModule, TranslateTestingModule],
      providers: [{ provide: MysqlQueryService, useValue: instance(MockedMysqlQueryService) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    const mysqlService = TestBed.inject(MysqlService);
    mysqlService['_config'] = { database: 'my_db' };

    fixture = TestBed.createComponent(DashboardComponent);
    page = new DashboardComponentPage(fixture);
    component = fixture.componentInstance;
  });

  xit('should correctly display the versions', () => {
    fixture.detectChanges();

    expect(page.coreVersion.innerHTML).toContain(versionRow.core_version);
    expect(page.coreRevision.innerHTML).toContain(versionRow.core_revision);
    expect(page.dbVersion.innerHTML).toContain(versionRow.db_version);
    expect(page.dbWorldVersion.innerHTML).toContain(worldDbVersion);
    expect(page.dbWarning).toBe(null);
    expect(component.error).toBe(false);
  });
});
