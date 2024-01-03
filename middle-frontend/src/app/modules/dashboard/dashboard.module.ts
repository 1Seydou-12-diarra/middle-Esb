import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {TableauDeBordComponent} from './tableau-de-bord/tableau-de-bord.component';
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet, Routes} from '@angular/router';
import {NgApexchartsModule} from "ng-apexcharts";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ProgressBarModule} from 'primeng/progressbar';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RippleModule} from 'primeng/ripple';
import {TooltipModule} from 'primeng/tooltip';
import {CardModule} from 'primeng/card';
import {SessionUssdComponent} from './session-ussd/session-ussd.component';
import {CalendarModule} from 'primeng/calendar';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {DashboardWelcomeComponent} from "./dashboard-welcome/dashboard-welcome.component";
import {SharedModule} from "../shared/shared.module";
import {ReplacePipe} from '../shared/model/pipe/pipe-replace';
import {TranslateService} from '@ngx-translate/core';
import {MessageModule} from "primeng/message";
import {MessagesModule} from "primeng/messages";
import { BreadcrumbModule } from 'primeng/breadcrumb';

const routes: Routes = [
  {
    path: '',
    component: DashboardWelcomeComponent,
    // component: ResetPasswordComponent,
  },
  {
    path: 'listeElectorale',
    component: TableauDeBordComponent,
  },
  {
    path: 'sessionUssd',
    component: SessionUssdComponent,
  },
];

@NgModule({
  declarations: [
    TableauDeBordComponent,
    SessionUssdComponent,
    DashboardWelcomeComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    CommonModule,
    RouterLinkActive,
    TooltipModule,
    RouterLink,
    RouterOutlet,
    ButtonModule,
    RippleModule,
    FormsModule,
    MultiSelectModule,
    DropdownModule,
    RadioButtonModule,
    CardModule,
    CalendarModule,
    TableModule,
    InputTextModule,
    RouterModule.forChild(routes),
    SharedModule,
    MessageModule,
    MessagesModule,
    BreadcrumbModule
  ],
  providers: [
    ReplacePipe, TranslateService, DecimalPipe
  ]
})
export class DashboardModule {
}
