export class AssignMemberToSiteDto {
    constructor({
                    siteId = "",
                    userId = "",
                    fullName = "",
                    email = "",
                    role = "operator",
                } = {}) {
        this.siteId = siteId;
        this.userId = userId;
        this.fullName = fullName.trim();
        this.email = email.trim();
        this.role = role;
    }

    isValid() {
        return Boolean(this.siteId && this.userId && this.fullName && this.email);
    }

    toPayload() {
        return {
            siteId: this.siteId,
            userId: this.userId,
            fullName: this.fullName,
            email: this.email,
            role: this.role,
        };
    }
}