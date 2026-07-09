import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { KnowledgeArticle } from "../../domain/model/knowledge-article.entity";
import { KnowledgeArticleResource } from "../resource/knowledge-article.resource";

export class KnowledgeArticleAssembler extends BaseAssembler {
    toEntity(resource) {
        return new KnowledgeArticle({
            id: resource.id,
            title: resource.title,
            summary: resource.summary,
            category: resource.category,
            content: resource.content,
            helpfulCount: resource.helpfulCount,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new KnowledgeArticleResource({
            id: entity.id,
            title: entity.title,
            summary: entity.summary,
            category: entity.category,
            content: entity.content,
            helpfulCount: entity.helpfulCount,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}