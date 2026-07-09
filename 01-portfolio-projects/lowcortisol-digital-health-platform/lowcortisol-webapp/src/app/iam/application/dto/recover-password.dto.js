export class RecoverPasswordDto {
    constructor({ email = "" } = {}) {
        this.email = email.trim().toLowerCase();
    }

    isValid() {
        return Boolean(this.email);
    }

    toPayload() {
        return {
            email: this.email,
        };
    }
}