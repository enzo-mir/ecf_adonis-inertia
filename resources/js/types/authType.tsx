import { currentReservation, User } from "./userType.store";

export type AuthType = {
  isLogged: boolean;
  type?: "user" | "admin";
  currentReservation?: Array<currentReservation>;
  userdata: User;
};
