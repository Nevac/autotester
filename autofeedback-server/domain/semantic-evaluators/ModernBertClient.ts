import {HfInference, sentenceSimilarity} from "@huggingface/inference";
import dotenv from "dotenv";
import SemanticEvaluatorClient from "./SemanticEvaluatorClient";
import {
    FeatureExtractionPipelineOptions,
    matmul,
    pipeline,
    PretrainedModelOptions,
    Tensor
} from "@huggingface/transformers";
import ExpectedFeedback from "../attempts/expected-feedback/expected-feedback";

export default class ModernBertClient implements SemanticEvaluatorClient {

    private readonly client: HfInference;
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

    public async evaluate(llmFeedback: string, expectedFeedback: ExpectedFeedback): Promise<number> {
        console.log("Expected Feedback: ", expectedFeedback);
        console.log("Llm Feedback: ", llmFeedback);

        let embedder = await pipeline(
            'feature-extraction',
            this.MODEL,
            this.pipelineConfig
        )

        const references = expectedFeedback.correctness.flatMap(fR => fR.references.map(reference => "search_query: " + reference));

        const feedbackSentences = llmFeedback.split(".").map(sentence => "search_document: " + sentence)

        // const s1 = "search_query: " + expectedFeedback.correctness[0].references;
        // const s2 = "search_document: " + llmFeedback;

        const ten = await embedder([...references, ...feedbackSentences], this.embedderConfig);

        const [t1, t2] = await embedder([...references, ...feedbackSentences], this.embedderConfig);

        const a = new Tensor('float32', t1.data, [1, t1.data.length]);
        const b = new Tensor('float32', t2.data, [t2.data.length, 1]);
        const simTensor = await matmul(a, b);

        return simTensor.data[0].toFixed(3);
    }
}