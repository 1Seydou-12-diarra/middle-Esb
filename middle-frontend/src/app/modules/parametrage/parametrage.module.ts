import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListerParametresComponent} from './lister-parametres/lister-parametres.component';
import {RouterLink, RouterLinkActive, RouterModule, RouterOutlet, Routes} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ProgressBarModule} from "primeng/progressbar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TooltipModule} from "primeng/tooltip";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {MultiSelectModule} from "primeng/multiselect";
import {DropdownModule} from "primeng/dropdown";
import {RadioButtonModule} from "primeng/radiobutton";
import {CardModule} from "primeng/card";
import {CalendarModule} from "primeng/calendar";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {ToolbarModule} from "primeng/toolbar"; 
import {DialogModule} from "primeng/dialog";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {MessageModule} from "primeng/message";
import {MessagesModule} from "primeng/messages";
import {InputSwitchModule} from 'primeng/inputswitch';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ChargementFichiersComponent } from './chargement-fichiers/chargement-fichiers.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import {CheckboxModule} from "primeng/checkbox";
import { InputMaskModule } from 'primeng/inputmask';

const routes: Routes = [

  {
    path: 'lister-parametre',
    component: ListerParametresComponent,
  },
  {
    path:'chargement-fichiers',
    component: ChargementFichiersComponent,
  }
];

@NgModule({
  declarations: [
    ListerParametresComponent,
    ChargementFichiersComponent
  ],
    imports: [
        CommonModule,
        ProgressSpinnerModule,
        ProgressBarModule,
        FormsModule,
        ReactiveFormsModule,
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
        InputSwitchModule,
        ConfirmPopupModule,
        RouterModule.forChild(routes),
        SharedModule,
        FileUploadModule,
        ToastModule,
        MessageModule,
        MessagesModule,
        BreadcrumbModule,
        CheckboxModule,
        InputMaskModule
    ]
})
export class ParametrageModule {
}
