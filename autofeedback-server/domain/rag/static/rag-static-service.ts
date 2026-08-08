import RagStaticRepository from "./rag-static-repository";
import RagStatic from "./rag-static";
import RagStaticListEntry from "./rag-static-list-entry";
import RagStaticUpdate from "./rag-static-update";

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

    public async create(promptGroupUpdate: RagStaticUpdate): Promise<RagStatic> {
        return await this.repository.create(promptGroupUpdate);
    }

    public async update(id: string, update: RagStaticUpdate): Promise<RagStatic> {
        return await this.repository.update(id, update);
    }

    public async delete(id: string): Promise<boolean> {
        return await this.repository.delete(id);
    }
}