import { create } from "zustand";
import { userDataType } from "../../types/userType.store";
import { connectionType } from "../../types/connectionType.store";

export const connectStore = create<connectionType>((set) => ({
  connectedUser: false,
  setConnectedUser: (val) => set(() => ({ connectedUser: val })),
  connectedAdmin: null,
  setConnectedAdmin: (val) => set(() => ({ connectedAdmin: val })),
}));

export const userDataStore = create<userDataType>((set) => ({
  userData: {
    id: 0,
    name: "",
    email: "",
    password: "",
    guests: 0,
    alergy: "",
    role: 0,
    currentReservation: [],
  },
  setUserData: (val) => set(() => ({ userData: val })),
}));
