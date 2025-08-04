import Embedding from "./embedding";

export default interface EmbeddingClient {
    embed(query: string): Promise<Embedding[]>
}