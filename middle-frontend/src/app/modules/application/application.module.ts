import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application/application.component';
import { RouterModule, Routes } from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {MessagesModule} from 'primeng/messages';
import {MultiSelectModule} from 'primeng/multiselect';
import {NgApexchartsModule} from 'ng-apexcharts';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RippleModule} from 'primeng/ripple';

// import {SharedModule} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ToolbarModule } from 'primeng/toolbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputSwitchModule } from 'primeng/inputswitch';

const routes: Routes = [

  {
    path: '',
    component: ApplicationComponent,
  },

];

@NgModule({
  declarations: [
    ApplicationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ButtonModule,
    InputTextModule,
    MessagesModule,
    MultiSelectModule,
    NgApexchartsModule,
    ProgressSpinnerModule,
    RippleModule,
    SharedModule,
    SharedModule,
    TableModule,
    TooltipModule,
    BreadcrumbModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ToolbarModule,
    ToggleButtonModule,
    InputSwitchModule
  ]
})
export class ApplicationModule { }
