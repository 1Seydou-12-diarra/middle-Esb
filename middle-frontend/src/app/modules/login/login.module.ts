import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/service/auth.service';
import { ConnexionComponent } from './connexion/connexion.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RouterModule, Routes } from '@angular/router';
import {ResetPasswordComponent} from "../shared/component/reset-password/reset-password.component";
import {DialogModule} from "primeng/dialog";
import {ToastModule} from "primeng/toast";
import {SharedModule} from "../shared/shared.module";
import {MessagesModule} from "primeng/messages";


const routes: Routes = [

  {
    path:'',
    component: ConnexionComponent,
  },

];


@NgModule({
  declarations: [
    ConnexionComponent
  ],
    imports: [
        CommonModule,
        CommonModule,
        PasswordModule,
        MessageModule,
        ButtonModule,
        ReactiveFormsModule,
        InputTextModule,
        ProgressSpinnerModule,
        RouterModule.forChild(routes),
        DialogModule,
        ToastModule,
        SharedModule,
        MessagesModule,
    ],
  providers:[AuthService]
})
export class LoginModule {


 }
