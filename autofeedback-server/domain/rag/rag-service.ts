import RagRepository from "./rag-repository";
import RagUpdate from "./rag-update";
import RagGroupListEntry from "./rag-group-list-entry";
import Rag from "./rag";
import ExerciseUpdate from "../exercises/exercise-update";
import {Exercise} from "../exercises/exercise";

export default class RagService {

    private readonly repository: RagRepository

    constructor(
    ) {
        this.repository = new RagRepository();
    }

    public async getAll(): Promise<Rag[]> {
        return await this.repository.getAll();
    }

    public async getAllListEntries(): Promise<RagGroupListEntry[]> {
        return await this.repository.getAllListEntries();
    }

    public async getById(id: string): Promise<Rag> {
        return await this.repository.getById(id);
    }

    public async create(promptGroupUpdate: RagUpdate): Promise<Rag> {
        return await this.repository.create(promptGroupUpdate);
    }

    public async update(id: string, update: RagUpdate): Promise<Rag> {
        return await this.repository.update(id, update);
    }

    public async delete(id: string): Promise<boolean> {
        return await this.repository.delete(id);
    }
}