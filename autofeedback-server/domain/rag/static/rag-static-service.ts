import RagStaticRepository from "./rag-static-repository";
import RagStatic from "./rag-static";
import RagStaticListEntry from "./rag-static-list-entry";
import RagStaticUpdate from "./rag-static-update";
import RagStaticUpdateDto from "./rag-static-update-dto";

export default class RagStaticService {

    private readonly repository: RagStaticRepository

    constructor(
    ) {
        this.repository = new RagStaticRepository();
    }

    public async getAll(): Promise<RagStatic[]> {
        return await this.repository.getAll();
    }

    public async getAllListEntries(): Promise<RagStaticListEntry[]> {
        return await this.repository.getAllListEntries();
    }

    public async getById(id: string): Promise<RagStatic> {
        return await this.repository.getById(id);
    }

    public async create(ragStaticUpdateDto: RagStaticUpdateDto): Promise<RagStatic> {
        return await this.repository.create(
            new RagStaticUpdate(
                ragStaticUpdateDto.name,
                new Map(ragStaticUpdateDto.exerciseRagDocuments.map(entry =>
                    [entry.entityId, entry.ragDocuments] as const
                )),
                new Map(ragStaticUpdateDto.attemptRagDocuments.map(entry =>
                    [entry.entityId, entry.ragDocuments] as const
                )),
            )
        );
    }

    public async update(id: string, update: RagStaticUpdateDto): Promise<RagStatic> {
        return await this.repository.update(
            id,
            new RagStaticUpdate(
                update.name,
                new Map(update.exerciseRagDocuments.map(entry =>
                    [entry.entityId, entry.ragDocuments] as const
                )),
                new Map(update.attemptRagDocuments.map(entry =>
                    [entry.entityId, entry.ragDocuments] as const
                )),
            )
        );
    }

    public async delete(id: string): Promise<boolean> {
        return await this.repository.delete(id);
    }
}