import { IamApiService } from "../../infrastructure/api/iam-api.service";
import { AuthSessionService } from "../../../shared/application/services/auth-session.service";

export class IamFacade {
    constructor() {
        this.iamApiService = new IamApiService();
    }

    async signIn(payload) {
        const result = await this.iamApiService.signIn(payload);

        AuthSessionService.signIn(result.user);

        return result;
    }

    async signUp(payload) {
        const result = await this.iamApiService.signUp(payload);

        AuthSessionService.signIn(result.user);

        return result;
    }

    async recoverPassword(payload) {
        return this.iamApiService.recoverPassword(payload);
    }

    async signOut() {
        const result = await this.iamApiService.signOut();

        AuthSessionService.signOut();

        return result;
    }

    async getProfile() {
        return this.iamApiService.getProfile();
    }

    async getAccessProfile() {
        return this.iamApiService.getAccessProfile();
    }

    async getSession() {
        return this.iamApiService.getSession();
    }

    async updateProfile(payload) {
        const user = await this.iamApiService.updateProfile(payload);

        AuthSessionService.setCurrentUser(user);

        return user;
    }

    async requestEmailChange(payload) {
        return this.iamApiService.requestEmailChange(payload);
    }

    async changePassword(payload) {
        return this.iamApiService.changePassword(payload);
    }
}
