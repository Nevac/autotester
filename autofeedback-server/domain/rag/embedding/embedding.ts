import OpenAI from "openai";
import EmbeddingOpenAi = OpenAI.Embedding;
import {CreateEmbeddingResponse} from "openai/resources";

export default class Embedding {
    constructor(
        public readonly embedding: Array<number>
    ) {}

    public static ofOpenAiEmbedding(embedding: EmbeddingOpenAi): Embedding {
        return new Embedding(embedding.embedding)
    }

    public static ofOpenAiResponse(response: CreateEmbeddingResponse): Embedding[] {
        return response.data
            .map(embedding => Embedding.ofOpenAiEmbedding(embedding))
    }
}