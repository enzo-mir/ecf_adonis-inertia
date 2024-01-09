export type User = {
  user?: {
    id?: number;
    name: string;
    email: string;
    password: string;
    guests: number | null;
    alergy: string;
    oldEmail?: string;
  };
  admin?: {};
};

export type currentReservationType = {
  guests: number;
  date: string;
  hours: string;
  email: string;
};

export type userDataType = {
  userData: User;
  setUserData(val: User): void;
  currentReservation: Array<currentReservationType>;
  setCurrentReservation(val: Array<currentReservationType>): void;
};
