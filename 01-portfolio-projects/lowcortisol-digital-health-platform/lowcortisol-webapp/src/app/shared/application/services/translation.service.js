import { computed, reactive } from "vue";

const LANGUAGE_KEY = "lowcortisol.language";
const DEFAULT_LANGUAGE = "es";

const state = reactive({
    language: localStorage.getItem(LANGUAGE_KEY) || DEFAULT_LANGUAGE,
    messages: {},
    loading: false,
    error: null,
});

function getNestedValue(source, path) {
    return path.split(".").reduce((current, key) => {
        if (current && Object.prototype.hasOwnProperty.call(current, key)) {
            return current[key];
        }

        return null;
    }, source);
}

export class TranslationService {
    static async initialize() {
        const savedLanguage = localStorage.getItem(LANGUAGE_KEY) || DEFAULT_LANGUAGE;
        await TranslationService.setLanguage(savedLanguage);
    }

    static async setLanguage(language) {
        state.loading = true;
        state.error = null;

        try {
            const response = await fetch(`/assets/i18n/${language}.json?v=${Date.now()}`);

            if (!response.ok) {
                throw new Error(`No se pudo cargar el idioma: ${language}`);
            }

            state.messages = await response.json();
            state.language = language;

            localStorage.setItem(LANGUAGE_KEY, language);
            document.documentElement.lang = language;
        } catch (error) {
            state.error = error.message || "No se pudo cargar el idioma.";

            if (language !== DEFAULT_LANGUAGE) {
                await TranslationService.setLanguage(DEFAULT_LANGUAGE);
            }
        } finally {
            state.loading = false;
        }
    }

    static getLanguage() {
        return state.language;
    }

    static translate(key) {
        return getNestedValue(state.messages, key) ?? key;
    }
}

export function useTranslation() {
    const language = computed(() => state.language);
    const loading = computed(() => state.loading);
    const error = computed(() => state.error);

    async function setLanguage(language) {
        await TranslationService.setLanguage(language);
    }

    function t(key) {
        return TranslationService.translate(key);
    }

    return {
        language,
        loading,
        error,
        setLanguage,
        t,
    };
}