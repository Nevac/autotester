import EvaluationGroupRepository from "./evaluation-group-repository";
import EvaluationGroupUpdateDto from "./evaluation-group-update-dto";
import EvaluationGroupListEntry from "./evaluation-group-list-entry";
import {EvaluationGroup} from "./evaluation-group";
import EvaluationGroupInsert from "./evaluation-group-insert";
import PromptGroupRepository from "../../prompts/prompt-group-repository";
import AttemptRepository from "../../attempts/attempt-repository";
import EvaluationService from "../evaluation-service";
import EvaluationGroupLlm from "./llm/evaluation-group-llm";
import EvaluationState from "../evaluation-state";
import {EvaluationScore} from "../evaluation-score";

export default class EvaluationGroupService {

    private readonly evaluationGroupRepository: EvaluationGroupRepository;
    private readonly promptGroupRepo: PromptGroupRepository;
    private readonly attemptRepository: AttemptRepository;
    private readonly evaluationService: EvaluationService;

    constructor(
    ) {
        this.evaluationGroupRepository = new EvaluationGroupRepository();
        this.promptGroupRepo = new PromptGroupRepository();
        this.attemptRepository = new AttemptRepository();
        this.evaluationService = new EvaluationService();
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
            new EvaluationGroupInsert(
                evaluationGroupUpdateDto.name,
                promptGroup,
                Array.from(attempts.values()),
                new Map(
                    Array.from(evaluationGroupUpdateDto.llms)
                        .map(llm =>
                            [llm, new EvaluationGroupLlm(
                                llm,
                                EvaluationState.INITIATED,
                                EvaluationScore.zero()
                            )])),
                EvaluationState.RUNNING
            )
        );
        await this.evaluationService.createByGroup(evalGroup);

        //TODO: Kickoff evaluation process

        return evalGroup;
    }

    public async delete(id: string): Promise<boolean> {
        const isDeleteEvaluationsSuccess = this.evaluationService.deleteByGroup(id);
        const isDeleteEvaluationGroupSuccess = this.evaluationGroupRepository.delete(id);
        return await Promise
            .all<boolean>([isDeleteEvaluationsSuccess, isDeleteEvaluationGroupSuccess])
            .then(result => result[0] && result[1]);
    }
}