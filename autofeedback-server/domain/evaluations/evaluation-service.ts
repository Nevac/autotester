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
import SemanticEvaluatorClient from "../semantic-evaluators/SemanticEvaluatorClient";
import ModernBertClient from "../semantic-evaluators/ModernBertClient";

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
        return await this.evaluationRepository.createAll(evaluations);
    }

    public async startEvaluation(evaluation: Evaluation) {
        const client = this.llmService.resolveLlmService(evaluation.llm);

        let ragDocuments: string[] = []
        if(evaluation.rag) {
            const ragClient = new PineconeClient(
                new TextEmbedding3LargeClient(),
                evaluation.rag.apiId
            );
            ragDocuments = await ragClient.retrieve(RagQueryBuilder.ofEvaluation(evaluation))
        }

        const response = await client.create(
            ClientRequest.ofEvaluation(
                evaluation,
                ragDocuments
            )
        );

        let a = await this.semanticEvaluatorClient.evaluate(response.messages[0], evaluation.attempt.expectedFeedback);

        console.log(a);
    }

    public async delete(id: string): Promise<boolean> {
        return await this.evaluationRepository.delete(id);
    }

    public async deleteByGroup(evaluationGroupId: string): Promise<boolean> {
        return await this.evaluationRepository.deleteAllByGroup(evaluationGroupId);
    }
}