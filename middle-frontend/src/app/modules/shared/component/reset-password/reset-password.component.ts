import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Message, MessageService} from "primeng/api";
import {UtilisateurService} from "../../service/utilisateur.service";
import {finalize} from "rxjs";
import {AuthService} from "../../service/auth.service";
import {CustomValidators} from "../../validator/custom-validator";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {


  @Input() visible: boolean;
  @Input() login: string;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() motDePasseChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  passwordForm: FormGroup;
  ouvrirModaleResetPassword!: boolean;
  messageActif = false;
  messagerecommandation = false;
  messageErreur: Message[] = [];
  captcha: string;
  isLoading: boolean;

  constructor(private formBuilder: FormBuilder,
              private messageService: MessageService,
              private utilisateurService: UtilisateurService,
              private authService: AuthService) {

  }

  ngOnInit(): void {
    this.captcha = '';
    this.passwordForm = this.formBuilder.group({
      login: [this.login],
      nouveau: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(6)]],
      ancien: [null, [Validators.required, Validators.maxLength(255)]],
      verifier: [null, [Validators.required, Validators.maxLength(255), Validators.minLength(6)]]
    });
    this.messageErreur = [];
    this.messageActif = false;
    this.messagerecommandation = false;

  }

  isTailleMinimumPasswordIvalide(): boolean {
    return this.passwordForm.get('nouveau').value?.length && this.passwordForm.get('nouveau').invalid;
  }

  ouverture() {
    this.messageErreur = []
    if (this.login) {
      this.passwordForm.get('login').setValue(this.login);
    }
    else {
      this.passwordForm.get('login').setValue(this.authService.getUtilisateurConnecte()?.username);
    }
  }

  fermerModale(change: boolean) {
   this.messagerecommandation=false;
    this.passwordForm.reset();
    this.visibleChange.emit(false);
    this.motDePasseChange.emit(change);
  }


  public onEnregistrerPassword() {
    if (this.passwordForm.invalid) {
      this.messageErreur = [{ detail: 'Veuillez saisir correctement tous les champs', severity: 'error'}];
      this.messageActif = true;
      this.messagerecommandation = true;
    } else if (this.passwordForm.get('nouveau') == this.passwordForm.get('verifier')) {
      this.messageErreur = [{ detail: 'Les mots de passes ne coincident pas', severity: 'error'}];
      this.messageActif = true;
    }
     else {  
      this.messageActif = false;
      this.messageErreur = [];
      this.isLoading = true
      this.utilisateurService.modifierPassword(this.passwordForm.getRawValue())
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(
          (value) => {
            this.messageService.add({severity: 'success', summary: 'Opération effectuée', detail: 'Changement de mot de passe effecctué avec succès.' })
            this.fermerModale(true);
          },
        error => {
          this.messageErreur = [{ detail: error.error?.message, severity: 'error'}]  ;
          this.messageActif = true;
        }
        );
    }
  }
}
