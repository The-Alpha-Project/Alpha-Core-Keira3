import { Injectable } from '@angular/core';
import { SingleRowEditorService } from '@keira-abstract/service/editors/single-row-editor.service';
import { MysqlQueryService } from '@keira-shared/services/mysql-query.service';
import { CreatureAddon, CREATURE_ADDON_ID, CREATURE_ADDON_TABLE } from '@keira-types/creature-template-addon.type';
import { ToastrService } from 'ngx-toastr';
import { CreatureHandlerService } from '../creature-handler.service';

@Injectable()
export class CreatureTemplateAddonService extends SingleRowEditorService<CreatureAddon> {
  /* istanbul ignore next */ // because of: https://github.com/gotwarlost/istanbul/issues/690
  constructor(
    protected handlerService: CreatureHandlerService,
    readonly queryService: MysqlQueryService,
    protected toastrService: ToastrService,
  ) {
    super(CreatureAddon, CREATURE_ADDON_TABLE, CREATURE_ADDON_ID, null, false, handlerService, queryService, toastrService);
  }
}
