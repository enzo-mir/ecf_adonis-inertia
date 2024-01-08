import { create } from "zustand";
import { CardType, HourType, ImageType } from "../../types/dataApiTypes";

export const hourStore = create<HourType>((set) => ({
  hours: [],
  setHours: (val) => set(() => ({ hours: val })),
}));
export const imageStore = create<ImageType>((set) => ({
  images: [],
  setImages: (val) => set(() => ({ images: val })),
}));

export const cardStore = create<CardType>((set) => ({
  cardStore: {
    starters: [{ id: 0, description: "", name: "", price: 0, sharing: 0 }],
    dishs: [{ id: 0, description: "", name: "", price: 0, sharing: 0 }],
    menus: [{ id: 0, name: "", formula: "", description: "" }],
    desserts: [{ id: 0, description: "", name: "", price: 0 }],
  },
  setCardStore: (val) => set(() => ({ cardStore: val })),
}));
