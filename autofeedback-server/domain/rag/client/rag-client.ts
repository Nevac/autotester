import RagDocument from "../document/rag-document";

export default interface RagClient {
    retrieve(query: string): Promise<RagDocument[]>
}