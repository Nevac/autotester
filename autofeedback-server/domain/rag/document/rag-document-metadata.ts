import {Document, model, Schema} from "mongoose";

interface IRagDocumentMetadata {
    text: string,
    constructs: string[],
    category: string,
    language: string,
    topic: string,
    type: string
}

export default class RagDocumentMetadata implements IRagDocumentMetadata{

    constructor(
        public readonly text: string,
        public readonly constructs: string[] = [],
        public readonly category: string = "",
        public readonly language: string = "",
        public readonly topic: string = "",
        public readonly type: string = "",
    ) {}
}

export const ragDocumentMetadataSchema = new Schema<IRagDocumentMetadata>(
    {
        text: { type: String, required: true },
        category: {type: String, required: false },
        language: {type: String, required: false },
        topic: {type: String, required: false },
        type: {type: String, required: false },
        constructs: {type: [String], required: true }
    },
    {
        timestamps: false,
    }
);

export type RagDocumentDocument = Document<unknown, {}, IRagDocumentMetadata> & IRagDocumentMetadata & {};
export const RagDocumentModel = model<IRagDocumentMetadata>('RagDocument', ragDocumentMetadataSchema);