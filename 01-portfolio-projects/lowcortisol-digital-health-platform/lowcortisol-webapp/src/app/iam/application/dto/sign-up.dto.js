export class SignUpDto {
    constructor({
                    fullName = "",
                    email = "",
                    phone = "",
                    password = "",
                } = {}) {
        this.fullName = fullName.trim();
        this.email = email.trim().toLowerCase();
        this.phone = phone.trim();
        this.password = password;
    }

    isValid() {
        return Boolean(this.fullName && this.email && this.password);
    }

    toPayload() {
        return {
            fullName: this.fullName,
            email: this.email,
            phone: this.phone,
            password: this.password,
        };
    }
}