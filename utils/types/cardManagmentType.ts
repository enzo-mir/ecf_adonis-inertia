export type cardManagmentType = {
  choiceEdit: "starters" | "dishs" | "desserts";
  oldTitle: string;
  oldDesc: string;
};

export type cardInfoType = {
  formula: string | null;
  title: string;
  desc: string;
  price: number;
};
