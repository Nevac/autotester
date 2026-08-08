import {Document, model, Schema} from "mongoose";
import EntityUtil from "../../entities/entity";
import Entity from "../../entities/entity";

export interface IRagStatic {
    name: string,
    exerciseRagDocuments: Map<string, string[]>,
    attemptRagDocuments: Map<string, string[]>,
}

export default class RagStatic implements IRagStatic, Entity {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly exerciseRagDocuments: Map<string, string[]>,
        public readonly attemptRagDocuments: Map<string, string[]>,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {
    }

    public static ofDocument(ragStatic: RagStaticDocument) {
        const [createdAt, updatedAt] = EntityUtil.checkForProperties(ragStatic)

        return new RagStatic(
            Entity.convertId(ragStatic._id),
            ragStatic.name,
            ragStatic.exerciseRagDocuments,
            ragStatic.attemptRagDocuments,
            createdAt,
            updatedAt
        )
    }
}

export const ragStaticSchema = new Schema<IRagStatic>(
    {
        name: { type: String, required: true },
        exerciseRagDocuments: {type: String, required: true },
        attemptRagDocuments: {type: String, required: true },
    },
    {
        timestamps: true
    }
);

export type RagStaticDocument = Document<unknown, {}, IRagStatic> & IRagStatic & {};
export const RagStaticModel = model<IRagStatic>('RagStatic', ragStaticSchema);
