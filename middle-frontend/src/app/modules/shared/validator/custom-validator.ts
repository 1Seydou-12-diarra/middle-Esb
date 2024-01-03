import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static notBlank(control: AbstractControl): ValidationErrors | null {
    if (!(control.value as string)?.trim().length) {
      return { spaceOnly: true };
    }

    return null;
  }

  public static matchValues(matchTo: string): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent && !!control.parent.value && control.value === control.parent.controls[matchTo].value ? null : { isMatching: false };
    };
  }
}
