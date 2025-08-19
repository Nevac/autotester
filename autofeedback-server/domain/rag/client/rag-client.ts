import EvaluationRagDocument from "../../evaluations/rag-document/evaluation-rag-document";
import RagDocumentUpsert from "../document/rag-document-upsert";
import RagResponse from "./rag-response";

export default interface RagClient {
    retrieve(query: string, astEnabled: boolean): Promise<RagResponse>
    upsertAll(ragDocuments: RagDocumentUpsert[]): Promise<void>
    upsert(ragDocument: RagDocumentUpsert): Promise<void>
    delete(id: string): Promise<void>
}