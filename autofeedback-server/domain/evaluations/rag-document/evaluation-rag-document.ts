import {Schema} from "mongoose";
import {QueryResponse, ScoredPineconeRecord} from "@pinecone-database/pinecone";
import RagResponseMetadata from "../../rag/rag-response-metadata";
import RagDoc from "../../rag/document/rag-doc";

interface IRagDocument {
    id: string,
    text: string,
    category: string,
    language: string,
    topic: string,
    type: string,
    constructs: string[]
}

export default class EvaluationRagDocument implements IRagDocument {
    constructor(
        public readonly id: string,
        public readonly text: string,
        public readonly category: string = "",
        public readonly language: string = "",
        public readonly topic: string = "",
        public readonly type: string = "",
        public readonly constructs: string[] = []
    ) {}

    public static ofPineconeRecords(records: ScoredPineconeRecord<RagResponseMetadata>[]): EvaluationRagDocument[] {
        return records.filter(record => record.metadata).map(record =>
            new EvaluationRagDocument(
                record.id,
                record.metadata!.text,
                record.metadata!.category,
                record.metadata!.language,
                record.metadata!.topic,
                record.metadata!.type,
                record.metadata!.constructs
            )
        );
    }

    public static ofRagDocs(ragDocs: RagDoc[]): EvaluationRagDocument[] {
        return ragDocs.map(ragDoc => EvaluationRagDocument.ofRagDoc(ragDoc));
    }

    public static ofRagDoc(ragDoc: RagDoc): EvaluationRagDocument {
        return new EvaluationRagDocument(
            ragDoc._id,
            ragDoc.metadata.text,
            ragDoc.metadata.category,
            ragDoc.metadata.language,
            ragDoc.metadata.topic,
            ragDoc.metadata.type,
            ragDoc.metadata.constructs
        )
    }
}

export const ragDocumentSchema = new Schema<IRagDocument>(
    {
        id: { type: String, required: true },
        text: { type: String, required: true },
        category: {type: String, required: true },
        language: {type: String, required: true },
        topic: {type: String, required: true },
        type: {type: String, required: true },
        constructs: {type: [String], required: true }
    },
    {
        _id: false,
        timestamps: false,
    }
);