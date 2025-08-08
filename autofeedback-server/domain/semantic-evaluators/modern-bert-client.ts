import {HfInference} from "@huggingface/inference";
import dotenv from "dotenv";
import SemanticEvaluatorClient from "./semantic-evaluator-client";
import {
    FeatureExtractionPipelineOptions,
    matmul,
    pipeline,
    PretrainedModelOptions,
    Tensor
} from "@huggingface/transformers";
import ExpectedFeedback from "../attempts/expected-feedback/expected-feedback";
import EvaluationSemanticStatistic from "../evaluations/statistic/evaluation-semantic-statistic";
import SemanticStatisticGenerator from "../evaluations/statistic/generator/semantic-statistic-generator";
import FeedbackMetric from "../attempts/expected-feedback/feedback-metric";
import ExpectedFeedbackEmbedding from "../evaluations/statistic/generator/expected-feedback-embedding";
import GeneratedFeedbackEmbedding from "../evaluations/statistic/generator/generated-feedback-embedding";
import GeneratedFeedbackExtractor from "./generaged-feedback-extractor/generated-feedback-extractor";

export default class ModernBertClient implements SemanticEvaluatorClient {

    private readonly client: HfInference;
    private readonly SCORE_THRESHOLD: number = 0.5;
    private readonly MODEL = 'lightonai/modernbert-embed-large';
    private readonly pipelineConfig: PretrainedModelOptions = {
        dtype: 'fp32'
    };
    private readonly embedderConfig: FeatureExtractionPipelineOptions = {
        pooling: 'mean',
        normalize: true
    };


    constructor() {

        dotenv.config()
        this.client = new HfInference(process.env['API_KEY_HUGGINGFACE']!);
    }

    public async evaluate(
        llmFeedback: string,
        expectedFeedback: ExpectedFeedback
    ): Promise<EvaluationSemanticStatistic> {
        console.log("Llm Feedback: ", llmFeedback);

        let extractor = await pipeline(
            'feature-extraction',
            this.MODEL,
            this.pipelineConfig
        )

        const expectedEmbeddings =
            [
                ...expectedFeedback.correctness,
                ...expectedFeedback.suggestion,
                ...expectedFeedback.codeStyle
            ]
            .flatMap(fR =>
                fR.references.map(reference =>
                    new ExpectedFeedbackEmbedding(
                        reference,
                        fR.id,
                        fR.metric
                    )
            ));
        expectedEmbeddings.forEach((embedding, index) =>
            embedding.index = index
        );

        const feedbackEmbeddings = Array.from(GeneratedFeedbackExtractor.extract(llmFeedback).map.entries()).flatMap((
            [
                metric,
                sentences
            ],
            index
        ) =>
            sentences.map(sentence =>
                new GeneratedFeedbackEmbedding(
                    sentence,
                    metric,
                    index
                )
            )
        );

        const queryEmbeddings = await extractor(
            expectedEmbeddings.map(embedding => "search_query: " + embedding.sentence),
            this.embedderConfig
        );
        const docEmbeddings = await extractor(
            feedbackEmbeddings.map(embedding => "search_document: " + embedding.sentence),
            this.embedderConfig
        );

        // Similarity matrix (queries x documents)
        const similarities = await matmul(queryEmbeddings, docEmbeddings.transpose(1, 0));
        const similarityScores: number[][] = similarities.tolist();

        return SemanticStatisticGenerator.generate(
            expectedEmbeddings,
            feedbackEmbeddings,
            similarityScores,
            this.SCORE_THRESHOLD
        );
    }

    private feedbackSanitizer(llmFeedback: string): string[] {
        const feedbacks =  llmFeedback
            .split("\n")
            .join(". ")
            .replace("### ", "")
            .replace("**", "")
            .replace("-", "")
            .replace("Correctness", "")
            .replace("Correctness:", "")
            .replace("1 Correctness:", "")
            .replace("1. Correctness", "")
            .replace("1. Correctness:", "")
            .replace("Suggestion", "")
            .replace("Suggestion:", "")
            .replace("2 Suggestion", "")
            .replace("2. Suggestion", "")
            .replace("2. Suggestion:", "")
            .replace("Code Style", "")
            .replace("Code Style:", "")
            .replace("3 Code Style", "")
            .replace("3. Code Style", "")
            .replace("3. Code Style:", "")
            .replace('"\n"', "")
            .replace("**", "")
            .replace("-", "")
            .split(".")
        return feedbacks
            .map(feedback => feedback.trimStart().trimEnd())
            .filter(filter => filter !== "" && filter !== " ")
    }
}