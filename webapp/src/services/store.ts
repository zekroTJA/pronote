import { AppTheme, getSystemTheme } from "../theme/theme";

import { List } from "../models/models";
import LocalStore from "./localstore";
import { create } from "zustand";

type Store = {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;

  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;

  lists: List[];
  setLists: (lists: List[]) => void;
};

export const useStore = create<Store>((set /*, get */) => ({
  loggedIn: false,
  setLoggedIn: (loggedIn) => set({ loggedIn }),

  theme: LocalStore.get("app.theme", getSystemTheme())!,
  setTheme: (theme) => {
    set({ theme });
    LocalStore.set("app.theme", theme);
  },

  lists: [],
  setLists: (lists) => set({ lists }),
}));
