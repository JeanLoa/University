import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class KnowledgeArticleResource extends BaseResource {
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
}