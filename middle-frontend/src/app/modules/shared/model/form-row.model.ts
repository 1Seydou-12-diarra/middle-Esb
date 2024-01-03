import {FormGroup} from "@angular/forms";

export class FormRow {

  constructor(public formGroup: FormGroup,
              public ecriture = false,
              public creation = false) {
  }

  reset() {
    this.ecriture = false;
    this.creation = false;
  }
}
