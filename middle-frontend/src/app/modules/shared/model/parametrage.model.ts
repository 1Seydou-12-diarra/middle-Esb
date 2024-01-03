import {CodeDesignation} from "./code-designation";

export class Parametrage extends CodeDesignation{
  valeur: string;
  actif: boolean;
  heure: string;

  deserialize(input: any): Parametrage {
    Object.assign(this, input);
    return this;
  }
}
