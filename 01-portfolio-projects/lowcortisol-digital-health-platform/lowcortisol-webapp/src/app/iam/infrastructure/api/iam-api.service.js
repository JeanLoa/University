import { AuthSessionService } from "../../../shared/application/services/auth-session.service";
import { LocalPlatformDataService } from "../../../shared/infrastructure/data/local-platform-data.service";

function normalizeUser(user) {
    if (!user) return null;

    const names = String(user.fullName || "")
        .split(" ")
        .filter(Boolean);

    const initials = names
        .slice(0, 2)
        .map((name) => name[0])
        .join("")
        .toUpperCase();

    return {
        ...user,
        initials: initials || "U",
        statusLabel: user.status === "active" ? "Activo" : "Inactivo",
    };
}

function normalizeAccessProfile(profile) {
    if (!profile) return null;

    const roleLabels = {
        owner: "Propietario",
        admin: "Administrador",
        operator: "Operador",
        viewer: "Visualizador",
    };

    return {
        ...profile,
        roleLabel: roleLabels[profile.role] || profile.role || "Sin rol",
        permissions: profile.permissions || [],
    };
}

export class IamApiService {
    async signIn(credentials) {
        const users = LocalPlatformDataService.list("users", {
            email: credentials.email,
            password: credentials.password,
        });

        const user = users[0];

        if (!user) {
            throw new Error("Correo o contrasena incorrectos.");
        }

        if (user.status !== "active") {
            throw new Error("La cuenta no esta activa.");
        }

        const accessProfile = LocalPlatformDataService.getById(
            "accessProfiles",
            user.accessProfileId
        );

        const session = {
            id: `SESSION-${Date.now()}`,
            userId: user.id,
            token: `session-token-${Date.now()}`,
            isActive: true,
            createdAt: new Date().toISOString(),
        };

        AuthSessionService.signIn(normalizeUser(user));

        return {
            user: normalizeUser(user),
            accessProfile: normalizeAccessProfile(accessProfile),
            session,
            message: "Inicio de sesion correcto.",
        };
    }

    async signUp(account) {
        const existingUsers = LocalPlatformDataService.list("users", {
            email: account.email,
        });

        if (existingUsers.length > 0) {
            throw new Error("Ya existe una cuenta registrada con este correo.");
        }

        const user = LocalPlatformDataService.create("users", {
            fullName: account.fullName,
            email: account.email,
            phone: account.phone,
            password: account.password,
            status: "active",
            accessProfileId: "PROFILE-OWNER",
        });

        const accessProfile = LocalPlatformDataService.getById(
            "accessProfiles",
            "PROFILE-OWNER"
        );

        const session = {
            id: `SESSION-${Date.now()}`,
            userId: user.id,
            token: `session-token-${Date.now()}`,
            isActive: true,
            createdAt: new Date().toISOString(),
        };

        AuthSessionService.signIn(normalizeUser(user));

        return {
            user: normalizeUser(user),
            accessProfile: normalizeAccessProfile(accessProfile),
            session,
            message: "Cuenta creada correctamente.",
        };
    }

    async recoverPassword(account) {
        const users = LocalPlatformDataService.list("users", {
            email: account.email,
        });

        if (users.length === 0) {
            throw new Error("No existe una cuenta registrada con ese correo.");
        }

        return {
            success: true,
            message: `Se enviaron instrucciones de recuperacion a ${account.email}.`,
        };
    }

    async signOut() {
        AuthSessionService.signOut();

        return {
            success: true,
            message: "Sesion cerrada correctamente.",
        };
    }

    async getProfile() {
        const currentUser = AuthSessionService.getCurrentUser();

        if (!currentUser) {
            return null;
        }

        const user = LocalPlatformDataService.getById("users", currentUser.id);

        AuthSessionService.setCurrentUser(normalizeUser(user));

        return normalizeUser(user);
    }

    async getAccessProfile() {
        const currentUser = AuthSessionService.getCurrentUser();

        if (!currentUser) {
            return null;
        }

        const profile = LocalPlatformDataService.getById(
            "accessProfiles",
            currentUser.accessProfileId
        );

        return normalizeAccessProfile(profile);
    }

    async getSession() {
        const currentUser = AuthSessionService.getCurrentUser();

        if (!currentUser) {
            return null;
        }

        return {
            id: `SESSION-${currentUser.id}`,
            userId: currentUser.id,
            token: "session-token-current",
            isActive: true,
            canAccess: true,
        };
    }

    async updateProfile(profile) {
        const currentUser = AuthSessionService.getCurrentUser();

        if (!currentUser) {
            throw new Error("No hay sesion activa.");
        }

        const updatedUser = LocalPlatformDataService.update("users", currentUser.id, {
            fullName: profile.fullName,
            phone: profile.phone,
        });

        AuthSessionService.setCurrentUser(normalizeUser(updatedUser));

        return normalizeUser(updatedUser);
    }

    async requestEmailChange(payload) {
        const currentUser = AuthSessionService.getCurrentUser();
        const newEmail = String(payload.newEmail || "").trim().toLowerCase();

        if (!currentUser) {
            throw new Error("No hay sesion activa.");
        }

        if (!newEmail || !newEmail.includes("@")) {
            throw new Error("Ingresa un correo electronico valido.");
        }

        if (newEmail === String(currentUser.email || "").toLowerCase()) {
            throw new Error("El correo nuevo debe ser diferente al actual.");
        }

        const existingUsers = LocalPlatformDataService
            .list("users", { email: newEmail })
            .filter((user) => user.id !== currentUser.id);

        if (existingUsers.length > 0) {
            throw new Error("Ya existe una cuenta registrada con ese correo.");
        }

        LocalPlatformDataService.update("users", currentUser.id, {
            pendingEmail: newEmail,
            emailChangeStatus: "pending_confirmation",
            emailChangeRequestedAt: new Date().toISOString(),
        });

        return {
            success: true,
            message: `Se envio un correo de confirmacion a ${newEmail}.`,
        };
    }

    async changePassword(payload) {
        const currentUser = AuthSessionService.getCurrentUser();

        if (!currentUser) {
            throw new Error("No hay sesion activa.");
        }

        const currentPassword = String(payload.currentPassword || "");
        const newPassword = String(payload.newPassword || "");

        if (!currentPassword || !newPassword) {
            throw new Error("Completa la contrasena actual y la nueva contrasena.");
        }

        if (newPassword.length < 6) {
            throw new Error("La nueva contrasena debe tener al menos 6 caracteres.");
        }

        const user = LocalPlatformDataService.getById("users", currentUser.id);

        if (!user || user.password !== currentPassword) {
            throw new Error("La contrasena actual no coincide.");
        }

        LocalPlatformDataService.update("users", currentUser.id, {
            password: newPassword,
            passwordChangedAt: new Date().toISOString(),
        });

        return {
            success: true,
            message: "Contrasena actualizada correctamente.",
        };
    }
}
