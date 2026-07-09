import { reactive, readonly } from "vue";
import { IamFacade } from "../services/iam.facade";

const iamFacade = new IamFacade();

const state = reactive({
    user: null,
    accessProfile: null,
    session: null,
    loading: false,
    error: null,
    message: "",
});

async function loadSession() {
    state.loading = true;
    state.error = null;

    try {
        state.user = await iamFacade.getProfile();
        state.accessProfile = await iamFacade.getAccessProfile();
        state.session = await iamFacade.getSession();
    } catch (error) {
        state.error = error.message || "No se pudo cargar la sesión.";
    } finally {
        state.loading = false;
    }
}

async function signIn(payload) {
    state.loading = true;
    state.error = null;
    state.message = "";

    try {
        const result = await iamFacade.signIn(payload);

        state.user = result.user;
        state.accessProfile = result.accessProfile;
        state.session = result.session;
        state.message = result.message;

        return result;
    } catch (error) {
        state.error = error.message || "No se pudo iniciar sesión.";
        throw error;
    } finally {
        state.loading = false;
    }
}

async function signUp(payload) {
    state.loading = true;
    state.error = null;
    state.message = "";

    try {
        const result = await iamFacade.signUp(payload);

        state.user = result.user;
        state.accessProfile = result.accessProfile;
        state.session = result.session;
        state.message = result.message;

        return result;
    } catch (error) {
        state.error = error.message || "No se pudo registrar la cuenta.";
        throw error;
    } finally {
        state.loading = false;
    }
}

async function recoverPassword(payload) {
    state.loading = true;
    state.error = null;
    state.message = "";

    try {
        const result = await iamFacade.recoverPassword(payload);

        state.message = result.message;

        return result;
    } catch (error) {
        state.error = error.message || "No se pudo enviar la recuperación.";
        throw error;
    } finally {
        state.loading = false;
    }
}

async function updateProfile(payload) {
    state.loading = true;
    state.error = null;
    state.message = "";

    try {
        state.user = await iamFacade.updateProfile(payload);
        state.message = "Perfil actualizado correctamente.";

        return state.user;
    } catch (error) {
        state.error = error.message || "No se pudo actualizar el perfil.";
        throw error;
    } finally {
        state.loading = false;
    }
}

async function requestEmailChange(payload) {
    state.loading = true;
    state.error = null;
    state.message = "";

    try {
        const result = await iamFacade.requestEmailChange(payload);

        state.message = result.message;

        return result;
    } catch (error) {
        state.error = error.message || "No se pudo solicitar el cambio de correo.";
        throw error;
    } finally {
        state.loading = false;
    }
}

async function changePassword(payload) {
    state.loading = true;
    state.error = null;
    state.message = "";

    try {
        const result = await iamFacade.changePassword(payload);

        state.message = result.message;

        return result;
    } catch (error) {
        state.error = error.message || "No se pudo actualizar la contrasena.";
        throw error;
    } finally {
        state.loading = false;
    }
}

async function signOut() {
    state.loading = true;
    state.error = null;
    state.message = "";

    try {
        const result = await iamFacade.signOut();

        state.session = null;
        state.message = result.message;

        return result;
    } catch (error) {
        state.error = error.message || "No se pudo cerrar sesión.";
        throw error;
    } finally {
        state.loading = false;
    }
}

export function useIamStore() {
    return {
        state: readonly(state),
        loadSession,
        signIn,
        signUp,
        recoverPassword,
        updateProfile,
        requestEmailChange,
        changePassword,
        signOut,
    };
}
