import { STORAGE_KEYS } from "../../infrastructure/constants/storage.keys";
import { LocalStorageService } from "../../infrastructure/storage/local-storage.service";

export const AVAILABLE_LANGUAGES = [
    {
        code: "es",
        label: "ES",
        name: "Español",
    },
    {
        code: "en",
        label: "EN",
        name: "English",
    },
    {
        code: "pt",
        label: "PT",
        name: "Português",
    },
];

export class UiPreferencesService {
    static getLanguage() {
        return LocalStorageService.get(
            STORAGE_KEYS.UI_LANGUAGE,
            import.meta.env.VITE_DEFAULT_LANGUAGE || "es"
        );
    }

    static setLanguage(language) {
        const exists = AVAILABLE_LANGUAGES.some((item) => item.code === language);
        const selectedLanguage = exists ? language : "es";

        LocalStorageService.set(STORAGE_KEYS.UI_LANGUAGE, selectedLanguage);

        return selectedLanguage;
    }

    static getAvailableLanguages() {
        return AVAILABLE_LANGUAGES;
    }
}