import RagClient from "./rag-client";
import EmbeddingClient from "../embedding/embedding-client";
import {Index, Pinecone} from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import RagResponseMetadata from "../RagResponseMetadata";

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
        this.index = this.client.index<RagResponseMetadata>(process.env['PINECONE_INDEX']!).namespace(namespace);
    }

    public async retrieve(query: string): Promise<string[]> {
        const embedding = await this.embeddingClient.embed(query);
        const results = await this.index.query({
            vector: embedding[0].embedding,
            topK: 3,
            includeMetadata: true
        });

        return results.matches.map(result => result.metadata!.text);
    }
}