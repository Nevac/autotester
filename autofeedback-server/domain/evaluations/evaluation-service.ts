import EvaluationRepository from "./evaluation-repository";
import EvaluationListEntry from "./evaluation-list-entry";
import {Evaluation} from "./evaluation";
import EvaluationUpdate from "./evaluation-update";
import {EvaluationGroup} from "./group/evaluation-group";
import {Llm} from "../llms/llm";
import {ClientRequest} from "../llms/llm-client";
import LlmService from "../llms/llm-service";
import TextEmbedding3LargeClient from "../rag/embedding/text-embedding3-large.client";
import PineconeClient from "../rag/client/pinecone-client";
import RagQueryBuilder from "../rag/rag-query-builder";
import SemanticEvaluatorClient from "../semantic-evaluators/semantic-evaluator-client";
import ModernBertClient from "../semantic-evaluators/modern-bert-client";
import EvaluationState from "./evaluation-state";
import ScoreCalculator from "./score/score-calculator";
import {logger} from "../../logger";
import RagDocument from "../rag/document/rag-document";

export default class EvaluationService {

    private readonly evaluationRepository: EvaluationRepository;
    private readonly llmService: LlmService;
    private readonly semanticEvaluatorClient: SemanticEvaluatorClient;

    constructor(
    ) {
        this.evaluationRepository = new EvaluationRepository();
        this.llmService = new LlmService();
        this.semanticEvaluatorClient = new ModernBertClient();
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
                        llm[0],
                        evaluationGroup.rag
                    )
                )
            }
        }
        return await this.evaluationRepository.createAll(
            evaluations
        );
    }

    public async evaluate(evaluation: Evaluation): Promise<Evaluation> {
        await this.update(
            evaluation._id,
            EvaluationUpdate.ofEvaluation(evaluation)
                .setState(EvaluationState.RUNNING)
        );

        try{
            logger.debug(`Starting evaluation with id ${evaluation._id}`)
            logger.debug(`Using model ${evaluation.llm}`)
            const client = this.llmService.resolveLlmService(evaluation.llm);

            let ragDocuments: RagDocument[] = []
            if(evaluation.rag) {
                const ragClient = new PineconeClient(
                    new TextEmbedding3LargeClient(),
                    evaluation.rag.apiId
                );
                ragDocuments = await ragClient.retrieve(RagQueryBuilder.ofEvaluation(evaluation))
            }

            logger.debug(`Generating feedback`)
            const response = await client.create(
                ClientRequest.ofEvaluation(
                    evaluation,
                    ragDocuments
                )
            );

            const llmFeedback = response.messages[0];
            evaluation = await this.update(
                evaluation._id,
                EvaluationUpdate.ofEvaluation(evaluation)
                    .setGeneratedFeedback(llmFeedback)
                    .setRagDocuments(ragDocuments)
            );

            const evaluationStatistic = await this.semanticEvaluatorClient.evaluate(
                llmFeedback,
                evaluation.attempt.expectedFeedback
            ).catch(err => {
                console.log(err);
                undefined
            });

            if(!evaluationStatistic) {
                throw new Error();
            }

            const evaluationScore = ScoreCalculator.generateScore(
                evaluation.attempt.expectedFeedback,
                evaluationStatistic
            );

            const evaluationUpdate = EvaluationUpdate.ofEvaluation(evaluation)
                .setSemanticStatistic(evaluationStatistic)
                .setState(EvaluationState.DONE)
                .setScore(evaluationScore);

            logger.info(`Evaluation DONE for ${evaluation._id} with llm ${evaluation.llm}`)
            return await this.update(evaluation._id, evaluationUpdate);

        } catch (e) {
            console.error(`Evaluation FAILED for ${evaluation._id} with llm ${evaluation.llm}, e`);
            const evaluationUpdate = EvaluationUpdate.ofEvaluation(evaluation)
                .setState(EvaluationState.FAILURE);

            return await this.update(evaluation._id, evaluationUpdate);
        }

    }

    public async update(id: string, update: EvaluationUpdate): Promise<Evaluation> {
        return await this.evaluationRepository.update(id, update);
    }

    public async delete(id: string): Promise<boolean> {
        return await this.evaluationRepository.delete(id);
    }

    public async deleteByGroup(evaluationGroupId: string): Promise<boolean> {
        return await this.evaluationRepository.deleteAllByGroup(evaluationGroupId);
    }
}