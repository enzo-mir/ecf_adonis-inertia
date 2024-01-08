export type User = {
  id?: number;
  name: string;
  email: string;
  password: string;
  guests: number | null;
  alergy: string;
  oldEmail?: string;
};
export type currentReservation = {
  guests: number;
  date: string;
  hours: string;
  email: string;
};

export type userDataType = {
  userData: User;
  setUserData(val: User): void;
  currentReservation: Array<currentReservation>;
  setCurrentReservation(val: Array<currentReservation>): void;
};
