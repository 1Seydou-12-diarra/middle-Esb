import {Component, OnInit, ViewChild} from '@angular/core';
import {MenuItem, Message, MessageService} from 'primeng/api';
import {ParametrageService} from '../../shared/service/parametrage.service';
import {finalize} from "rxjs";
import {FileUpload} from "primeng/fileupload";

@Component({
  selector: 'app-chargement-fichiers',
  templateUrl: './chargement-fichiers.component.html',
  styleUrls: ['./chargement-fichiers.component.scss'],
  providers: [MessageService]
})
export class ChargementFichiersComponent implements OnInit {

  uploadedFiles: any[] = [];
  preparedFile!: any;
  isLoading: boolean;
  ouvrirModaleEnvoi: boolean;
  ErreurFormatFichier: string = "Format de fichier invalide";
  detailsErreurFormatFichier: string = "seuls les fichiers csv sont autorisés";
  nombreLignes: number;
  @ViewChild("upload") upload: FileUpload;

  messageActif: boolean;
  messageErreur: Message[] = [];
  items: MenuItem[];
  home: MenuItem;

  isProcessing: boolean;
  type: boolean = true; 

  constructor(private messageService: MessageService,
              private parametrageService: ParametrageService) {
  }


  ngOnInit(): void {
    this.messageErreur = [];
    this.messageActif = false;
    this.items = [
      {label: 'Paramétrage'},
      {label: 'Chargement de fichiers'},
    ];
    this.home = {icon: 'pi pi-home'};
    this.type = true;
  }

  onUpload(event) {
    if (event.files.length > 0) {
      var mimeType = event.files[0].type;
      if (mimeType.match(/.csv/) == null) {
        this.messageErreur = [{detail: 'seuls les fichiers csv sont autorisés', severity: 'error'}];
        this.messageActif = true;
        return;
      } else {
        this.isLoading = true;
        this.messageActif = false;
        this.messageErreur = [];
        const file = event.files[0];

        this.parametrageService.deposerFichier(file, this.type)
          .pipe(
            finalize(
              () => this.isLoading = false
            )
          )
          .subscribe(
            (nombreJson) => {
              this.nombreLignes = nombreJson.nombre;
              this.ouvrirModaleEnvoi = true;
            },
            (err) => {
              this.messageErreur = [{detail: err.error?.message, severity: 'error'}];
              this.messageActif = true
            }
          );
      }
    }
  }

  fermerModale() {
    this.ouvrirModaleEnvoi = false;
    this.nombreLignes = null;
    this.upload.clear();
  }

  onEnvoyerFichier() {
    this.isProcessing = true;
    this.messageActif = false;
    this.messageErreur = [];
    this.parametrageService.processFichier()
      .pipe(
        finalize(
          () => this.isProcessing = false
        )
      ).subscribe(
      () => {
        this.ouvrirModaleEnvoi = false;
        this.messageErreur = [{detail: 'Chargement effectué avec succès.', severity: 'success'}];
        this.messageActif = true;
        this.upload.clear();
      },
      (err) => {
        this.messageErreur = [{detail: err.error?.message, severity: 'error'}];
        this.messageActif = true
      }
    )
  }
}
