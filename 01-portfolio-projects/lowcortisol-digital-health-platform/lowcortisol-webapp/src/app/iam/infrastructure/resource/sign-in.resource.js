export class SignInResource {
    constructor({ email = "", password = "" } = {}) {
        this.email = email;
        this.password = password;
    }
}