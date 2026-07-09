export class SignInDto {
    constructor({ email = "", password = "" } = {}) {
        this.email = email.trim().toLowerCase();
        this.password = password;
    }

    isValid() {
        return Boolean(this.email && this.password);
    }

    toPayload() {
        return {
            email: this.email,
            password: this.password,
        };
    }
}