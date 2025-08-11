import RagClient from "./rag-client";
import EmbeddingClient from "../embedding/embedding-client";
import {Index, Pinecone} from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import RagResponseMetadata from "../rag-response-metadata";
import EvaluationRagDocument from "../../evaluations/rag-document/evaluation-rag-document";
import RagDocumentUpsert from "../document/rag-document-upsert";

export default class PineconeClient implements RagClient {

    private readonly client: Pinecone;
    private readonly index: Index<RagResponseMetadata>;

    constructor(
        private readonly embeddingClient: EmbeddingClient,
        namespace: string
    ) {
        dotenv.config();
        this.client = new Pinecone({
            apiKey: process.env['API_KEY_PINECONE']!
        })
        this.index = this.client.index<RagResponseMetadata>(process.env['PINECONE_INDEX']!).namespace("main");
    }

    public async retrieve(query: string): Promise<EvaluationRagDocument[]> {
        const embedding = await this.embeddingClient.embed(query);
        const results = await this.index.query({
            vector: embedding[0].embedding,
            topK: 3,
            includeMetadata: true
        });

        return EvaluationRagDocument.ofRagResult(results);
    }

    public async upsertAll(ragDocuments: RagDocumentUpsert[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async upsert(ragDocument: RagDocumentUpsert): Promise<void> {
        const embedding = await this.embeddingClient.embed(ragDocument.metadata.text);

        await this.index.upsert([
            {
                id: ragDocument.externalId,
                values: embedding[0].embedding,
                metadata: ragDocument.metadata
            }
        ])
    }

    public async delete(id: string): Promise<void> {
        await this.index.deleteOne(id);
    }
}