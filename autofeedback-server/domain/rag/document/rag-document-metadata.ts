import {Document, model, Schema} from "mongoose";

interface IRagDocumentMetadata {
    text: string,
    category: string,
    language: string,
    topic: string,
    type: string,
    constructs: string[]
}

export default class RagDocumentMetadata implements IRagDocumentMetadata{

    constructor(
        public readonly text: string,
        public readonly category: string,
        public readonly language: string,
        public readonly topic: string,
        public readonly type: string,
        public readonly constructs: string[]
    ) {}
}

export const ragDocumentMetadataSchema = new Schema<IRagDocumentMetadata>(
    {
        text: { type: String, required: true },
        category: {type: String, required: true },
        language: {type: String, required: true },
        topic: {type: String, required: true },
        type: {type: String, required: true },
        constructs: {type: [String], required: true }
    },
    {
        timestamps: false,
    }
);

export type RagDocumentDocument = Document<unknown, {}, IRagDocumentMetadata> & IRagDocumentMetadata & {};
export const RagDocumentModel = model<IRagDocumentMetadata>('RagDocument', ragDocumentMetadataSchema);