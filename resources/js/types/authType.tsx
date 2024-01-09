import { currentReservationType, User } from "./userType.store";

export type AuthType = {
  isLogged: boolean;
  type?: "user" | "admin";
  currentReservation?: Array<currentReservationType>;
  userdata: User;
};
