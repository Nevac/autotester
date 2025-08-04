import EmbeddingClient from "./embedding-client";
import OpenAI from "openai";
import Embedding from "./embedding";

export default class TextEmbedding3LargeClient implements EmbeddingClient {

    private readonly client: OpenAI;

    constructor() {
        this.client = new OpenAI({
            apiKey: process.env['API_KEY_CHAT_GPT'],
        });
    }

    public async embed(query: string): Promise<Embedding[]> {
        const embeddingResponse = await this.client.embeddings.create({
            model: "text-embedding-3-large",
            dimensions: 3072,
            input: query,
            encoding_format: "float",
        });

        return Embedding.ofOpenAiResponse(embeddingResponse);
    }
}