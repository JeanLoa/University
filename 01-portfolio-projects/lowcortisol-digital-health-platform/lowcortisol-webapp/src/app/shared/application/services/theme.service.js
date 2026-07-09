import { STORAGE_KEYS } from "../../infrastructure/constants/storage.keys";
import { LocalStorageService } from "../../infrastructure/storage/local-storage.service";

export const THEMES = {
    LIGHT: "light",
    DARK: "dark",
};

export class ThemeService {
    static getTheme() {
        return LocalStorageService.get(STORAGE_KEYS.UI_THEME, THEMES.LIGHT);
    }

    static setTheme(theme) {
        const selectedTheme = Object.values(THEMES).includes(theme)
            ? theme
            : THEMES.LIGHT;

        document.documentElement.dataset.theme = selectedTheme;
        LocalStorageService.set(STORAGE_KEYS.UI_THEME, selectedTheme);

        return selectedTheme;
    }

    static toggleTheme() {
        const currentTheme = this.getTheme();
        const nextTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;

        return this.setTheme(nextTheme);
    }

    static initialize() {
        return this.setTheme(this.getTheme());
    }
}