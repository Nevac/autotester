import {Document, model, Schema} from "mongoose";
import EntityUtil from "../../entities/entity";
import Entity from "../../entities/entity";
import RagStatic from "./rag-static";
import RagStaticDocuments from "./rag-static-documents";


export default class RagStaticDto {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly exerciseRagDocuments: RagStaticDocuments[],
        public readonly attemptRagDocuments: RagStaticDocuments[],
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {
    }

    public static fromModel(ragStatic: RagStatic): RagStaticDto {
        const [createdAt, updatedAt] = EntityUtil.checkForProperties(ragStatic)

        return new RagStaticDto(
            ragStatic._id,
            ragStatic.name,
            Array.from(ragStatic.exerciseRagDocuments.entries()).map(([exerciseId, ragDocumentIds]) =>
                new RagStaticDocuments(
                    exerciseId,
                    ragDocumentIds
                )
            ),
            Array.from(ragStatic.attemptRagDocuments.entries()).map(([attemptId, ragDocumentIds]) =>
                new RagStaticDocuments(
                    attemptId,
                    ragDocumentIds
                )
            ),
            createdAt,
            updatedAt
        )
    }
}