import {Document, model, Schema} from "mongoose";
import Entity from "../entities/entity";
import EntityUtil from "../entities/entity";

export interface IRag {
    name: string,
    apiId: string
}

export default class Rag implements IRag, Entity {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly apiId: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {
    }

    public static ofDocument(promptGroup: RagDocument) {
        const [createdAt, updatedAt] = EntityUtil.checkForProperties(promptGroup)

        return new Rag(
            Entity.convertId(promptGroup._id),
            promptGroup.name,
            promptGroup.apiId,
            createdAt,
            updatedAt
        )
    }
}

export const ragSchema = new Schema<IRag>(
    {
        name: { type: String, required: true },
        apiId: {type: String, required: true }
    },
    {
        timestamps: true
    }
);

export type RagDocument = Document<unknown, {}, IRag> & IRag & {};
export const RagModel = model<IRag>('Rag', ragSchema);
