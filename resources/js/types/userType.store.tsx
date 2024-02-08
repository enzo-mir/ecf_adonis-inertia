export type User = {
  id: number;
  name: string;
  email: string;
  guests: number | null;
  alergy: string;
  role: 0 | 1;
  currentReservation: Array<currentReservationType>;
};

export type usersInformationType = {
  id: number;
  name: string;
  email: string;
  role: 0 | 1;
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
};
