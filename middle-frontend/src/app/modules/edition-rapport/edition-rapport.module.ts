import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EtatConsultationsComponent } from './etat-consultations/etat-consultations.component';
import { ChiffreAfffairesComponent } from './chiffre-afffaires/chiffre-afffaires.component';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import {ToolbarModule} from 'primeng/toolbar';
import {DialogModule} from 'primeng/dialog';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import { ReplacePipe } from '../shared/model/pipe/pipe-replace';
import { SharedModule } from "../shared/shared.module";
import { TranslateService } from '@ngx-translate/core';
import { TagModule } from 'primeng/tag';
import {MessageModule} from "primeng/message";
import {MessagesModule} from "primeng/messages";
import { BreadcrumbModule } from 'primeng/breadcrumb';

const routes: Routes = [

  {
    path:'etat-consultations',
    component: EtatConsultationsComponent,
  },
  {
    path:'chiffre-affaires',
    component: ChiffreAfffairesComponent,
  },

];


@NgModule({
  declarations: [
    EtatConsultationsComponent,
    ChiffreAfffairesComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
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
    ToolbarModule,
    DialogModule,
    ConfirmPopupModule,
    TagModule,
    RouterModule.forChild(routes),
    SharedModule,
    MessageModule,
    MessagesModule,
    BreadcrumbModule
  ],
  providers: [DatePipe,ReplacePipe, TranslateService]
})
export class EditionRapportModule { }
