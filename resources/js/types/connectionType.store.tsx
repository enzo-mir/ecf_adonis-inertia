export type connectionType = {
  connectedUser: boolean;
  setConnectedUser(val: boolean): void;
  connectedAdmin: boolean | null;
  setConnectedAdmin(val: boolean): void;
};
