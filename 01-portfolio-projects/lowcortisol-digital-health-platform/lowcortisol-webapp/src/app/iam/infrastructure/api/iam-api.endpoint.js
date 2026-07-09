import { BaseApiEndpoint } from "../../../shared/infrastructure/api/base-api.endpoint";
import { UserAssembler } from "../assembler/user.assembler";

export class IamApiEndpoint extends BaseApiEndpoint {
    constructor() {
        super("/iam", new UserAssembler());
    }

    async signIn(resource) {
        return this.postToPath("/sign-in", resource);
    }

    async signUp(resource) {
        return this.postToPath("/sign-up", resource);
    }

    async signOut() {
        return this.postToPath("/sign-out");
    }

    async recoverPassword(resource) {
        return this.postToPath("/recover-password", resource);
    }

    async getProfile() {
        const response = await this.getFromPath("/profile");
        const resource = response?.data ?? response;

        return this.assembler.toEntity(resource);
    }

    async updateProfile(resource) {
        const response = await this.postToPath("/profile", resource);
        const updatedResource = response?.data ?? response;

        return this.assembler.toEntity(updatedResource);
    }
}