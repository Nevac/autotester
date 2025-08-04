import {FeatureExtractionOutput, HfInference, SentenceSimilarityArgs} from "@huggingface/inference";
import dotenv from "dotenv";
import SemanticEvaluatorClient from "./SemanticEvaluatorClient";

export default class CodeBertClient implements SemanticEvaluatorClient {

    private readonly client: HfInference;

    constructor() {
        dotenv.config()
        this.client = new HfInference(process.env['API_KEY_HUGGINGFACE']!);
    }

    public async evaluate(llmFeedback: string, expectedFeedback: string): Promise<number> {
        console.log("Expected Feedback: ", expectedFeedback);
        console.log("Llm Feedback: ", llmFeedback);

        // const llmFeedbackEmbedding = await this.client.featureExtraction({
        //     inputs: llmFeedback,
        //     model: "sentence-transformers/all-MiniLM-L6-v2",
        // });
        // const expectedFeedbackEmbedding = await this.client.featureExtraction({
        //     inputs: expectedFeedback,
        //     model: "sentence-transformers/all-MiniLM-L6-v2",
        // });
        //
        // return this.cosineSimilarity(
        //     this.averageVector(
        //         this.convertTo2DArray(llmFeedbackEmbedding)
        //     ),
        //     this.averageVector(
        //         this.convertTo2DArray(expectedFeedbackEmbedding)
        //     )
        // );

        const llmFeedbackEmbedding = await this.client.sentenceSimilarity({
            inputs: {
                source_sentence: llmFeedback,
                sentences: [expectedFeedback]
            },
            model: "sentence-transformers/all-MiniLM-L6-v2",
        });
        console.log(llmFeedbackEmbedding);
        return 0;
    }

    private convertTo2DArray(output: FeatureExtractionOutput): number[][] {
        if(this.is2DArray(output)) {
            return output as number[][];
        } else {
            throw new Error("Unexpected embedding output format from CodeBERT.");
        }
    }

    private is2DArray(arr: FeatureExtractionOutput): arr is number[][] {
        return Array.isArray(arr) && Array.isArray(arr[0]) && typeof arr[0][0] === "number";
    }

    private averageVector(vectors: number[][]): number[] {
        const vectorLength = vectors[0].length;
        const sum = new Array(vectorLength).fill(0);

        for (const vec of vectors) {
            for (let i = 0; i < vectorLength; i++) {
                sum[i] += vec[i];
            }
        }

        return sum.map(val => val / vectors.length);
    }

    private cosineSimilarity(vecA: number[], vecB: number[]): number {
        if (vecA.length !== vecB.length) {
            throw new Error("Vectors must have the same dimensions");
        }
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magnitudeA = Math.hypot(...vecA);
        const magnitudeB = Math.hypot(...vecB);
        if (magnitudeA === 0 || magnitudeB === 0) {
            return 0;
        }
        return dotProduct / (magnitudeA * magnitudeB);
    }
}