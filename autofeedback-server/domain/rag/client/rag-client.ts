import EmbeddingClient from "../embedding/embedding-client";

export default interface RagClient {
    retrieve(query: string): Promise<string[]>
}