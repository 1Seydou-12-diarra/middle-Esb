import {RepartitionParOperateur} from "./repartition-par-operateur.model";

export class TableauBordSessionUSSD {
  totalSession: number;
  sessionEnCours: number;
  sessionTimeout: number;
  sessionTerminee: number;
  totalSessionParOperateur: RepartitionParOperateur[];
  sessionEnCoursParOperateur: RepartitionParOperateur[];
  sessionTimeoutParOperateur: RepartitionParOperateur[];
  sessionTermineeParOperateur: RepartitionParOperateur[];
}
