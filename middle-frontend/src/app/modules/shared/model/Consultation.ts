export class Consultation {
	id: number;
	dateConsultation: Date;
	operateur: string;
	numeroAbonne: string;
	dureeSession: number;
	statut: string;

  deserialize(input: any): Consultation {
    const obj = Object.assign(this, input);

    // if (input.dateConsultation) {
    //   this.dateConsultation = new Date(input.dateConsultation[0], input.dateConsultation[1], input.dateConsultation[2],
    //     input.dateConsultation[3], input.dateConsultation[4]);
    // }

    return this;
  }
}
