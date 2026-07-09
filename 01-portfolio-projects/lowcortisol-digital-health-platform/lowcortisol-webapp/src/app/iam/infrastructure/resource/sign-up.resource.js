export class SignUpResource {
    constructor({
                    fullName = "",
                    email = "",
                    phone = "",
                    password = "",
                } = {}) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }
}