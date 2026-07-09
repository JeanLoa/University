export class LocalStorageService {
    static get(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);

            if (value === null || value === undefined) {
                return fallback;
            }

            return JSON.parse(value);
        } catch (error) {
            console.warn(`[LocalStorageService] No se pudo leer la clave: ${key}`, error);
            return fallback;
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`[LocalStorageService] No se pudo guardar la clave: ${key}`, error);
            return false;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`[LocalStorageService] No se pudo eliminar la clave: ${key}`, error);
            return false;
        }
    }

    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.warn("[LocalStorageService] No se pudo limpiar el almacenamiento", error);
            return false;
        }
    }
}