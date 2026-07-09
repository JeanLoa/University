import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class KnowledgeArticle extends BaseEntity {
    constructor({
                    id = null,
                    title = "",
                    summary = "",
                    category = "technical",
                    content = "",
                    helpfulCount = 0,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.title = title;
        this.summary = summary;
        this.category = category;
        this.content = content;
        this.helpfulCount = helpfulCount;
    }

    markHelpful() {
        this.helpfulCount += 1;
        this.updateTimestamp();
    }

    get categoryLabel() {
        const labels = {
            technical: "Técnico",
            billing: "Facturación",
            device: "Dispositivos",
            alerts: "Alertas",
        };

        return labels[this.category] ?? "Ayuda";
    }
}
