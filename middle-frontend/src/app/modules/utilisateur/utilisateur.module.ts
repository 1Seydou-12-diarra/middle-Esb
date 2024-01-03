import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ReplacePipe } from '../shared/model/pipe/pipe-replace';
import { MessageModule } from 'primeng/message';
import {SharedModule} from "../shared/shared.module";
import {MessagesModule} from "primeng/messages";
import { BreadcrumbModule } from 'primeng/breadcrumb';


const routes: Routes = [
  {
    path:'',
    component: UtilisateurComponent,
  }
];


@NgModule({
  declarations: [
    UtilisateurComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgApexchartsModule,
        ProgressSpinnerModule,
        ProgressBarModule,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        TooltipModule,
        ButtonModule,
        RippleModule,
        FormsModule,
        MessageModule,
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
        RouterModule.forChild(routes),
        SharedModule,
        MessagesModule,
        BreadcrumbModule
    ],
  providers: [
    ReplacePipe
  ]
})
export class UtilisateurModule { }
