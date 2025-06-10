import EvaluationRepository from "./evaluation-repository";
import EvaluationListEntry from "./evaluation-list-entry";
import {Evaluation} from "./evaluation";
import EvaluationUpdate from "./evaluation-update";

export default class EvaluationService {

    private readonly attemptRepository: EvaluationRepository;

    constructor(
    ) {
        this.attemptRepository = new EvaluationRepository();
    }

    public async getAll(): Promise<Evaluation[]> {
        return await this.attemptRepository.getAll();
    }

    public async getAllListEntries(): Promise<EvaluationListEntry[]> {
        return await this.attemptRepository.getAllListEntries();
    }

    public async getById(id: string): Promise<Evaluation> {
        return await this.attemptRepository.getById(id);
    }

    public async create(evaluationUpdate: EvaluationUpdate): Promise<Evaluation> {
        return await this.attemptRepository.create(evaluationUpdate);
    }

    public async delete(id: string): Promise<boolean> {
        return await this.attemptRepository.delete(id);
    }
}