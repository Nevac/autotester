import RagDocumentRepository from "./rag-document-repository";
import RagDocumentUpsert from "./rag-document-upsert";
import RagDocumentListEntry from "./rag-document-list-entry";
import RagDoc from "./rag-doc";
import RagClient from "../client/rag-client";
import PineconeClient from "../client/pinecone-client";
import TextEmbedding3LargeClient from "../embedding/text-embedding3-large.client";

export default class RagDocumentService {

    private readonly repository: RagDocumentRepository
    private readonly rag: RagClient

    constructor() {
        this.repository = new RagDocumentRepository();
        this.rag = new PineconeClient(
            new TextEmbedding3LargeClient(),
            "main"
        );
    }

    public async getAll(): Promise<RagDoc[]> {
        return await this.repository.getAll();
    }

    public async getAllListEntries(): Promise<RagDocumentListEntry[]> {
        return await this.repository.getAllListEntries();
    }

    public async getById(id: string): Promise<RagDoc> {
        return await this.repository.getById(id);
    }

    public async create(upsert: RagDocumentUpsert): Promise<RagDoc> {
        const ragDocument =  await this.repository.create(upsert);
        await this.rag.upsert(upsert);
        return ragDocument;
    }

    public async update(id: string, upsert: RagDocumentUpsert): Promise<RagDoc> {
        try {
            await this.rag.upsert(upsert);
            return await this.repository.update(id, upsert);
        } catch (e) {
            console.error(`Couldn't update RAG Document ${upsert.externalId}`)
            throw e;
        }
    }

    public async delete(id: string): Promise<boolean> {
        await this.rag.delete(id);
        return await this.repository.delete(id);
    }
}