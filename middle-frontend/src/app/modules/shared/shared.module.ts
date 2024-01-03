import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {SidebarComponent} from './component/sidebar/sidebar.component';
import {SublevelMenuComponent} from './component/sidebar/sublevel-menu.component';
import {ReplacePipe} from './model/pipe/pipe-replace';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {TooltipModule} from 'primeng/tooltip';
import {HeaderComponent} from './component/header/header.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ResetPasswordComponent} from './component/reset-password/reset-password.component';
import {MessageModule} from 'primeng/message';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {RecaptchaModule} from 'ng-recaptcha';
import {ToastModule} from 'primeng/toast';
import {SplitButtonModule} from 'primeng/splitbutton';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {MessageService} from "primeng/api";
import {MessagesModule} from "primeng/messages";

@NgModule({
  declarations: [
    SidebarComponent,
    SublevelMenuComponent,
    HeaderComponent,
    ReplacePipe,
    ResetPasswordComponent],
  exports: [
    SidebarComponent,
    HeaderComponent,
    ReplacePipe,
    CurrencyPipe,
    ResetPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    CommonModule,
    RouterLinkActive,
    TooltipModule,
    RouterLink,
    RouterOutlet,
    ButtonModule,
    PasswordModule,
    RippleModule,
    FormsModule,
    DialogModule,
    MessageModule,
    MultiSelectModule,
    DropdownModule,
    RadioButtonModule,
    RecaptchaModule,
    ToastModule,
    SplitButtonModule,
    NgbModule,
    ProgressSpinnerModule,
    MessagesModule
  ],
  providers: [
    ReplacePipe, MessageService
  ]
})
export class SharedModule {  
}
