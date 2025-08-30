import ExerciseRepository from "./exercise-repository";
import {Exercise} from "./exercise";
import ExerciseUpdate from "./exercise-update";
import ExerciseListEntry from "./exercise-list-entry";

export default class ExerciseService {

    private readonly repository: ExerciseRepository

    constructor(
    ) {
        this.repository = new ExerciseRepository();
    }

    public async findAllByIds(ids: string[]): Promise<Exercise[]> {
        return await this.repository.findAllByIds(ids);
    }

    public async getAll(): Promise<Exercise[]> {
        return await this.repository.getAll();
    }

    public async getAllListEntries(): Promise<ExerciseListEntry[]> {
        return await this.repository.getAllListEntries();
    }

    public async getById(id: string): Promise<Exercise> {
        return await this.repository.getById(id);
    }

    public async create(exercise: ExerciseUpdate): Promise<Exercise> {
        return await this.repository.create(exercise);
    }

    public async update(id: string, update: ExerciseUpdate): Promise<Exercise> {
        return await this.repository.update(id, update);
    }

    public async delete(id: string): Promise<boolean> {
        return await this.repository.delete(id);
    }
}