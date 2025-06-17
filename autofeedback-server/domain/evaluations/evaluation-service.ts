import EvaluationRepository from "./evaluation-repository";
import EvaluationListEntry from "./evaluation-list-entry";
import {Evaluation} from "./evaluation";
import EvaluationUpdate from "./evaluation-update";
import {EvaluationGroup} from "./group/evaluation-group";
import {Llm} from "../llms/llm";

export default class EvaluationService {

    private readonly evaluationRepository: EvaluationRepository;

    constructor(
    ) {
        this.evaluationRepository = new EvaluationRepository();
    }

    public async getAll(): Promise<Evaluation[]> {
        return await this.evaluationRepository.getAll();
    }

    public async getAllListEntries(evaluationGroupId: string, llm: Llm): Promise<EvaluationListEntry[]> {
        return await this.evaluationRepository.getAllListEntries(evaluationGroupId, llm);
    }

    public async getById(id: string): Promise<Evaluation> {
        return await this.evaluationRepository.getById(id);
    }

    public async create(evaluationUpdate: EvaluationUpdate): Promise<Evaluation> {
        return await this.evaluationRepository.create(evaluationUpdate);
    }

    public async createByGroup(evaluationGroup: EvaluationGroup): Promise<Map<string, Evaluation>> {
        const evaluations = [];
        for(const llm of evaluationGroup.llms) {
            for(const attempt of evaluationGroup.attempts.values()) {
                evaluations.push(
                    new EvaluationUpdate(
                        evaluationGroup.name + "-" + attempt.name,
                        evaluationGroup._id,
                        attempt,
                        evaluationGroup.promptGroup,
                        llm[0]
                    )
                )
            }
        }
        return await this.evaluationRepository.createAll(evaluations);
    }

    public async delete(id: string): Promise<boolean> {
        return await this.evaluationRepository.delete(id);
    }

    public async deleteByGroup(evaluationGroupId: string): Promise<boolean> {
        return await this.evaluationRepository.deleteAllByGroup(evaluationGroupId);
    }
}