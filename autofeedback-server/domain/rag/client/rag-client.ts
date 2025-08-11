import EvaluationRagDocument from "../../evaluations/rag-document/evaluation-rag-document";
import RagDocumentUpsert from "../document/rag-document-upsert";

export default interface RagClient {
    retrieve(query: string): Promise<EvaluationRagDocument[]>
    upsertAll(ragDocuments: RagDocumentUpsert[]): Promise<void>
    upsert(ragDocument: RagDocumentUpsert): Promise<void>
    delete(id: string): Promise<void>
}