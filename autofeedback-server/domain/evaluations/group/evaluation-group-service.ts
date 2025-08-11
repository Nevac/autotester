import EvaluationGroupRepository from "./evaluation-group-repository";
import EvaluationGroupUpdateDto from "./evaluation-group-update-dto";
import EvaluationGroupListEntry from "./evaluation-group-list-entry";
import {EvaluationGroup} from "./evaluation-group";
import EvaluationGroupUpsert from "./evaluation-group-upsert";
import PromptGroupRepository from "../../prompts/prompt-group-repository";
import AttemptRepository from "../../attempts/attempt-repository";
import EvaluationService from "../evaluation-service";
import EvaluationGroupLlm from "./llm/evaluation-group-llm";
import EvaluationState from "../evaluation-state";
import RagRepository from "../../rag/rag-repository";
import {Evaluation} from "../evaluation";
import {Llm} from "../../llms/llm";
import {EvaluationGroupLlmScore} from "./llm/evaluation-group-llm-score";

export default class EvaluationGroupService {

    private readonly evaluationGroupRepository: EvaluationGroupRepository;
    private readonly promptGroupRepo: PromptGroupRepository;
    private readonly attemptRepository: AttemptRepository;
    private readonly ragRepository: RagRepository;
    private readonly evaluationService: EvaluationService;

    constructor() {
        this.evaluationGroupRepository = new EvaluationGroupRepository();
        this.promptGroupRepo = new PromptGroupRepository();
        this.attemptRepository = new AttemptRepository();
        this.ragRepository = new RagRepository();
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

        let rag;
        if (evaluationGroupUpdateDto.ragId) {
            rag = await this.ragRepository.getById(evaluationGroupUpdateDto.ragId)
        }

        const evalGroup = await this.evaluationGroupRepository.create(
            new EvaluationGroupUpsert(
                evaluationGroupUpdateDto.name,
                promptGroup,
                Array.from(attempts.values()),
                new Map(
                    Array.from(evaluationGroupUpdateDto.llms)
                        .map(llm =>
                            [
                                llm,
                                new EvaluationGroupLlm(
                                    llm,
                                    EvaluationState.INITIATED,
                                    EvaluationGroupLlmScore.zero()
                                )
                            ]
                        )
                ),
                EvaluationState.RUNNING,
                rag
            )
        );
        const evaluations = await this.evaluationService.createByGroup(evalGroup);

        this.evaluateAll(evalGroup, evaluations);

        return evalGroup;
    }

    private async evaluateAll(
        evaluationGroup: EvaluationGroup,
        evaluations: Map<string, Evaluation>
    ): Promise<void> {
        const scoredEvaluations = await Promise.all(
            Array.from(evaluations.values()).map(evaluation =>
                this.evaluationService.evaluate(evaluation)
            )
        )

        await this.evaluationGroupRepository.update(
            evaluationGroup._id,
            this.calculateAndSetLlmScores(
                scoredEvaluations,
                evaluationGroup
            ).setState(EvaluationState.DONE)
        );
    }

    private calculateAndSetLlmScores(
        evaluations: Evaluation[],
        evaluationGroup: EvaluationGroup
    ): EvaluationGroupUpsert {
        let bestLlm: Llm | undefined = undefined;
        let bestScore: number = 0;

        const scoredEvaluationGroupLlms = new Map(
            Array.from(evaluationGroup.llms.keys())
                .map(llm => {
                    const evaluationGroupLlm = this.calculateLlmScore(llm, evaluations);
                    const llmScore = evaluationGroupLlm.score;
                    if(llmScore.total > bestScore) {
                        bestLlm = llm;
                        bestScore = parseFloat(llmScore.total.toPrecision(4));
                    }

                    return [
                        llm,
                        evaluationGroupLlm
                    ];
                }
            )
        );

        return EvaluationGroupUpsert.ofEvaluationGroup(evaluationGroup)
            .setLlms(scoredEvaluationGroupLlms)
            .setBestLlm(bestLlm)
            .setBestScore(bestScore);
    }

    private calculateLlmScore(llm: Llm, evaluations: Evaluation[]) {

        let averageScore = EvaluationGroupLlmScore.zero();

        const llmEvaluations = evaluations.filter(evaluation => evaluation.llm === llm)
        const total = llmEvaluations.length
        let state = EvaluationState.DONE;

        if (total != 0) {
            for (const evaluation of llmEvaluations) {
                if(evaluation.state === EvaluationState.FAILURE) {
                    state = EvaluationState.FAILURE;
                }

                const score = evaluation.score;

                averageScore = averageScore.add(
                    score.total / total,
                    score.correctness.score / total,
                    score.suggestion.score / total,
                    score.codeStyle.score / total,
                    score.overgeneration.score / total
                )
            }
        }

        return new EvaluationGroupLlm(
            llm,
            state,
            averageScore.toPrecision(4)
        )
    }


    public async update(id: string, update: EvaluationGroupUpsert) {
        return await this.evaluationGroupRepository.update(id, update);
    }

    public async delete(id: string): Promise<boolean> {
        const isDeleteEvaluationsSuccess = this.evaluationService.deleteByGroup(id);
        const isDeleteEvaluationGroupSuccess = this.evaluationGroupRepository.delete(id);
        return await Promise
            .all<boolean>([isDeleteEvaluationsSuccess, isDeleteEvaluationGroupSuccess])
            .then(result => result[0] && result[1]);
    }
}