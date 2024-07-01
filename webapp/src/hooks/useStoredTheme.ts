import { AppTheme, DarkTheme, LightTheme } from "../theme/theme";

import { useStore } from "../services/store";

const useStoredTheme = () => {
  const appTheme = useStore((s) => s.theme);

  switch (appTheme) {
    case AppTheme.DARK:
      return DarkTheme;
    case AppTheme.LIGHT:
      return LightTheme;
  }
};

export default useStoredTheme;
