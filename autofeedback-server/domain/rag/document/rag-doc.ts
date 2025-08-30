import {Document, model, Schema} from "mongoose";
import Entity from "../../entities/entity";
import EntityUtil from "../../entities/entity";
import RagDocumentMetadata, {ragDocumentMetadataSchema} from "./rag-document-metadata";
import {AttemptDocument} from "../../attempts/attempt";

export interface IRagDoc {
    externalId: string,
    metadata: RagDocumentMetadata
}

export default class RagDoc implements IRagDoc, Entity {
    constructor(
        public readonly _id: string,
        public readonly externalId: string,
        public readonly metadata: RagDocumentMetadata,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}

    public static ofDocument(ragDocument: RagDocDocument) {
        const [createdAt, updatedAt] = EntityUtil.checkForProperties(ragDocument)

        return new RagDoc(
            Entity.convertId(ragDocument._id),
            ragDocument.externalId,
            ragDocument.metadata,
            createdAt,
            updatedAt
        )
    }

    public static ofDocumentsToMap(ragDocDocuments: RagDocDocument[]): Map<string, RagDoc> {
        return new Map(
            ragDocDocuments.map(ragDocDocument => [
                EntityUtil.convertId(ragDocDocument._id),
                RagDoc.ofDocument(ragDocDocument)
            ]));
    }
}

export const ragDocumentSchema = new Schema<IRagDoc>(
    {
        externalId: { type: String, required: true },
        metadata: {type: ragDocumentMetadataSchema, required: true }
    },
    {
        timestamps: true
    }
);

export type RagDocDocument = Document<unknown, {}, IRagDoc> & IRagDoc & {};
export const RagDocModel = model<IRagDoc>('RagDoc', ragDocumentSchema);