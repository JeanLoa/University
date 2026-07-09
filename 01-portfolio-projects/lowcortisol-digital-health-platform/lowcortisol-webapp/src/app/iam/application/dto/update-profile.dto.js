export class UpdateProfileDto {
    constructor({
                    fullName = "",
                    phone = "",
                } = {}) {
        this.fullName = fullName.trim();
        this.phone = phone.trim();
    }

    isValid() {
        return Boolean(this.fullName);
    }

    toPayload() {
        return {
            fullName: this.fullName,
            phone: this.phone,
        };
    }
}