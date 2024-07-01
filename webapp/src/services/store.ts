import { AppTheme, getSystemTheme } from "../theme/theme";

import LocalStore from "./localstore";
import { create } from "zustand";

type Store = {
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;

  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
};

export const useStore = create<Store>((set /*, get */) => ({
  loggedIn: false,
  setLoggedIn: (loggedIn) => set({ loggedIn }),

  theme: LocalStore.get("app.theme", getSystemTheme())!,
  setTheme: (theme) => {
    set({ theme });
    LocalStore.set("app.theme", theme);
  },
}));
