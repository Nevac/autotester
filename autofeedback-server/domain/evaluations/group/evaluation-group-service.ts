import EvaluationGroupRepository from "./evaluation-group-repository";
import EvaluationGroupUpdateDto from "./evaluation-group-update-dto";
import EvaluationGroupListEntry from "./evaluation-group-list-entry";
import {EvaluationGroup} from "./evaluation-group";
import EvaluationGroupUpdate from "./evaluation-group-update";
import PromptGroupRepository from "../../prompts/prompt-group-repository";
import AttemptRepository from "../../attempts/attempt-repository";
import EvaluationUpdate from "../evaluation-update";
import EvaluationState from "../evaluation-state";
import EvaluationRepository from "../evaluation-repository";

export default class EvaluationGroupService {

    private readonly evaluationGroupRepository: EvaluationGroupRepository;
    private readonly promptGroupRepo: PromptGroupRepository;
    private readonly attemptRepository: AttemptRepository;
    private readonly evaluationRepository: EvaluationRepository;

    constructor(
    ) {
        this.evaluationGroupRepository = new EvaluationGroupRepository();
        this.promptGroupRepo = new PromptGroupRepository();
        this.attemptRepository = new AttemptRepository();
        this.evaluationRepository = new EvaluationRepository();
    }

    public async getAll(): Promise<EvaluationGroup[]> {
        return await this.evaluationGroupRepository.getAll();
    }

    public async getAllListEntries(): Promise<EvaluationGroupListEntry[]> {
        return await this.evaluationGroupRepository.getAllListEntries();
    }

    public async getById(id: string): Promise<EvaluationGroup> {
        return await this.evaluationGroupRepository.getById(id);
    }

    public async create(evaluationGroupUpdateDto: EvaluationGroupUpdateDto): Promise<EvaluationGroup> {
        const promptGroup = await this.promptGroupRepo.getById(evaluationGroupUpdateDto.promptGroupId);
        const attempts = await this.attemptRepository.getByIds(evaluationGroupUpdateDto.attemptIds);

        const evalGroup = await this.evaluationGroupRepository.create(
            new EvaluationGroupUpdate(
                evaluationGroupUpdateDto.name,
                promptGroup,
                Array.from(attempts.values()),
                Array.from(evaluationGroupUpdateDto.llms),
                EvaluationState.RUNNING
            )
        );

        const evaluations = [];
        for(const llm of evalGroup.llms) {
            for(const attempt of attempts.values()) {
                evaluations.push(
                    new EvaluationUpdate(
                        evaluationGroupUpdateDto.name + "-" + attempt.name,
                        attempt,
                        promptGroup,
                        llm
                    )
                )
            }
        }
        await this.evaluationRepository.createAll(evaluations)

        return evalGroup;
    }

    public async delete(id: string): Promise<boolean> {
        return await this.evaluationGroupRepository.delete(id);
    }
}