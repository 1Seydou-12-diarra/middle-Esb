import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ProtectionDroits } from './modules/shared/guards/protection-droits.guard';

const routes: Routes = [
  { path: '',
  children: [
   {path: '**', redirectTo:'login',pathMatch:'full'},
    //{path: '', redirectTo:'connexion',pathMatch:'full'},
    // {path: 'connexion',
    //loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
    //},
    {path: 'accueil', component: AppComponent},
    // {path: '', redirectTo: '/accueil', pathMatch: 'full'},
    {path: 'tableau-de-bord',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {path: 'edition-rapport',
    loadChildren: () => import('./modules/edition-rapport/edition-rapport.module').then(m => m.EditionRapportModule)
    },
    {path: 'parametrage',
      loadChildren: () => import('./modules/parametrage/parametrage.module').then(m => m.ParametrageModule),
      canActivate : [ProtectionDroits]
    },
    {path: 'applications',
    loadChildren: () => import('./modules/application/application.module').then(m => m.ApplicationModule),
    //canActivate : [ProtectionDroits]
    },
    {path: 'utilisateurs',
    loadChildren: () => import('./modules/utilisateur/utilisateur.module').then(m => m.UtilisateurModule),
    
    },
  ]
   },
  {      path: '**', redirectTo: ''   },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
