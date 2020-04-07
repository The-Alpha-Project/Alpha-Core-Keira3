import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { toastrConfig } from '@keira-config/toastr.config';

import { TopBarModule } from '@keira-shared/modules/top-bar/top-bar.module';
import { QueryOutputModule } from '@keira-shared/modules/query-output/query-output.module';
import { QuestRequestItemsComponent } from './quest-request-items.component';
import { SingleValueSelectorModule } from '@keira-shared/modules/selectors/single-value-selector/single-value-selector.module';
import { QuestRequestItemsService } from './quest-request-items.service';
import { QuestPreviewModule } from '../quest-preview/quest-preview.module';

@NgModule({
  declarations: [
    QuestRequestItemsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    TopBarModule,
    QueryOutputModule,
    TooltipModule.forRoot(),
    ToastrModule.forRoot(toastrConfig),
    SingleValueSelectorModule,
    QuestPreviewModule,
  ],
  exports: [
    QuestRequestItemsComponent,
  ],
  providers: [
    QuestRequestItemsService,
  ],
})
export class QuestRequestItemsModule {}
