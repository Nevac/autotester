import PromptGroupRepository from "./prompt-group-repository";
import PromptGroupUpdate from "./prompt-group-update";
import PromptGroupListEntry from "./prompt-group-list-entry";
import PromptGroup from "./prompt-group";
import ExerciseUpdate from "../exercises/exercise-update";
import {Exercise} from "../exercises/exercise";

export default class PromptGroupService {

    private readonly repository: PromptGroupRepository

    constructor(
    ) {
        this.repository = new PromptGroupRepository();
    }

    public async getAll(): Promise<PromptGroup[]> {
        return await this.repository.getAll();
    }

    public async getAllListEntries(): Promise<PromptGroupListEntry[]> {
        return await this.repository.getAllListEntries();
    }

    public async getById(id: string): Promise<PromptGroup> {
        return await this.repository.getById(id);
    }

    public async create(promptGroupUpdate: PromptGroupUpdate): Promise<PromptGroup> {
        return await this.repository.create(promptGroupUpdate);
    }

    public async update(id: string, update: PromptGroupUpdate): Promise<PromptGroup> {
        return await this.repository.update(id, update);
    }

    public async delete(id: string): Promise<boolean> {
        return await this.repository.delete(id);
    }
}