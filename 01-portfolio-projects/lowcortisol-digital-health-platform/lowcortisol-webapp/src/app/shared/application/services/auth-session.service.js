const AUTH_KEY = "lowcortisol.auth";
const USER_KEY = "lowcortisol.user";

export class AuthSessionService {
    static signIn(user) {
        localStorage.setItem(AUTH_KEY, "true");
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    static signOut() {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(USER_KEY);
    }

    static isAuthenticated() {
        return localStorage.getItem(AUTH_KEY) === "true";
    }

    static getCurrentUser() {
        const rawUser = localStorage.getItem(USER_KEY);

        if (!rawUser) {
            return null;
        }

        try {
            return JSON.parse(rawUser);
        } catch {
            return null;
        }
    }

    static setCurrentUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
}