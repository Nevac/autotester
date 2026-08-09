import EvaluationGroupRepository from "./evaluation-group-repository";
import EvaluationGroupInsertDto from "./evaluation-group-insert-dto";
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
import pLimit from "p-limit";
import {logger} from "../../../logger";
import {EvaluationScoreCorrection} from "../score/correction/evaluation-score-correction";
import DocumentEvaluationsContentGenerator from "../../export/document-evaluations-content-generator";
import ExportDocumentGenerator from "../../export/document-generator";
import EvaluationGroupStatisticRequestDto from "./statistics/evaluation-group-statistic-request-dto";
import EvaluationGroupStatistic from "./statistics/evaluation-group-statistic";
import StatisticGenerator from "./statistics/statistic-generator";
import RagStaticRepository from "../../rag/static/rag-static-repository";

export default class EvaluationGroupService {

    private readonly evaluationGroupRepository: EvaluationGroupRepository;
    private readonly promptGroupRepo: PromptGroupRepository;
    private readonly attemptRepository: AttemptRepository;
    private readonly ragRepository: RagRepository;
    private readonly ragStaticRepository: RagStaticRepository;
    private readonly evaluationService: EvaluationService;

    constructor() {
        this.evaluationGroupRepository = new EvaluationGroupRepository();
        this.promptGroupRepo = new PromptGroupRepository();
        this.attemptRepository = new AttemptRepository();
        this.ragRepository = new RagRepository();
        this.ragStaticRepository = new RagStaticRepository();
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

    public async create(evaluationGroupUpdateDto: EvaluationGroupInsertDto): Promise<EvaluationGroup> {
        const promptGroup = await this.promptGroupRepo.getById(evaluationGroupUpdateDto.promptGroupId);
        const attempts = await this.attemptRepository.getByIds(evaluationGroupUpdateDto.attemptIds);

        let rag;
        if (evaluationGroupUpdateDto.ragId) {
            rag = await this.ragRepository.getById(evaluationGroupUpdateDto.ragId)
        }


        let ragStatic;
        if (evaluationGroupUpdateDto.ragStaticId) {
            ragStatic = await this.ragStaticRepository.getById(evaluationGroupUpdateDto.ragStaticId);
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
                evaluationGroupUpdateDto.astEnabled,
                rag,
                ragStatic
            )
        );
        const evaluations = await this.evaluationService.createByGroup(evalGroup);

        this.evaluateAll(evalGroup, evaluations);

        return evalGroup;
    }

    public async retryEvaluation(id: string): Promise<EvaluationGroup> {
        const evalGroup = await this.evaluationGroupRepository.getById(id);
        const evaluations = await this.evaluationService.getAllNotDoneByGroupId(id);

        this.evaluateAll(evalGroup, evaluations);

        return evalGroup;
    }

    public async calculateScoreAllEvaluations(id: string): Promise<EvaluationGroup> {
        const evalGroup = await this.evaluationGroupRepository.getById(id);

        const evaluations = await this.evaluationService.getByGroupId(id);
        await this.evaluationService.calculateScoresFromStatistic(evaluations)

        await this.scoreEvaluationGroup(evalGroup);
        return evalGroup;
    }

    public async recalculateScore(id: string): Promise<EvaluationGroup> {
        const evalGroup = await this.evaluationGroupRepository.getById(id);
        await this.scoreEvaluationGroup(evalGroup);
        return evalGroup;
    }

    public async correctScore(
        evaluationGroupId: string,
        evaluationId: string,
        correction: EvaluationScoreCorrection
    ): Promise<Evaluation> {
        const evaluation = await this.evaluationService.correctScore(evaluationId, correction)
        await this.recalculateScore(evaluationGroupId);
        return evaluation;
    }

    private async evaluateAll(
        evaluationGroup: EvaluationGroup,
        evaluations: Map<string, Evaluation>
    ): Promise<void> {
        const limit = pLimit(2);
        let done = 0;
        let toDo = evaluations.size;

        await Promise.all(
            Array.from(evaluations.values()).map(ev =>
                limit(async () => {
                    await this.evaluationService.evaluate(ev);
                    logger.debug(`EVAL PROGRESS: ${++done} / ${toDo}`);
                })
            )
        );

        await this.scoreEvaluationGroup(evaluationGroup);

        logger.debug("Evaluation Group DONE");
    }

    private async scoreEvaluationGroup(evaluationGroup: EvaluationGroup) {
        const scoredEvaluations = Array.from(
            (await this.evaluationService.getByGroupId(evaluationGroup._id)).values()
        );

        await this.evaluationGroupRepository.update(
            evaluationGroup._id,
            this.calculateAndSetLlmScores(scoredEvaluations, evaluationGroup).setState(EvaluationState.DONE)
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


    public async export(ids: string[]): Promise<Buffer> {
        const evaluationGroups = await this.evaluationGroupRepository.getAllByIds(ids);
        const evaluations = await this.evaluationService.getByGroupIds(ids);

        const htmlContent = DocumentEvaluationsContentGenerator.generate(
            evaluationGroups,
            evaluations
        );
        return await ExportDocumentGenerator.pdf("Anhang 3. Evaluation mit RAG AST", htmlContent);
    }

    public async statistic(request: EvaluationGroupStatisticRequestDto): Promise<EvaluationGroupStatistic> {
        const evaluationGroupBase = await this.evaluationGroupRepository.getById(request.evaluationGroupBaseId);
        const evaluationGroupCompares = await this.evaluationGroupRepository.getAllByIds(request.evaluationGroupCompareIds);
        const groupIds = [...Array.from(evaluationGroupCompares.values()), evaluationGroupBase].map(evaluationGroup => evaluationGroup._id);
        const evaluations = await this.evaluationService.getByGroupIds(groupIds);

        return StatisticGenerator.generate(
            evaluationGroupBase,
            Array.from(evaluationGroupCompares.values()),
            evaluations
        );
    }
}