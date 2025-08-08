import EvaluationSemanticStatistic from "../evaluation-semantic-statistic";
import GeneratedFeedbackSemanticStatistic from "../generated-feedback-semantic-statistic";
import ExpectedFeedbackSemanticStatistic from "../expected-feedback-semantic-statistic";
import ExpectedFeedbackSemanticScore from "../expected-feedback-semantic-score";
import GeneratedFeedbackSemanticScore from "../generated-feedback-semantic-score";
import ExpectedFeedbackEmbedding from "./expected-feedback-embedding";
import GeneratedFeedbackEmbedding from "./generated-feedback-embedding";

export default class SemanticStatisticGenerator {

    public static generate(
        expectedEmbeddings: ExpectedFeedbackEmbedding[],
        generatedEmbeddings: GeneratedFeedbackEmbedding[],
        similarityScores: number[][],
        scoreThreshold: number
    ): EvaluationSemanticStatistic {
        return new SemanticStatisticGenerator(scoreThreshold)
            .generateEvaluationStatistics(
                expectedEmbeddings,
                generatedEmbeddings,
                similarityScores
            );
    }

    constructor(
        private readonly SCORE_THRESHOLD: number
    ) {}

    public generateEvaluationStatistics(
        expectedEmbeddings: ExpectedFeedbackEmbedding[],
        generatedEmbeddings: GeneratedFeedbackEmbedding[],
        similarityScores: number[][]
    ): EvaluationSemanticStatistic {
        const generatedFeedbackStatistics: Map<number, GeneratedFeedbackSemanticStatistic> = new Map();
        const expectedFeedbackStatistics: ExpectedFeedbackSemanticStatistic[] = [];

        for (const expectedEmbeddingIndex in expectedEmbeddings) {

            const expectedEmbedding = expectedEmbeddings[expectedEmbeddingIndex];
            const expectedStatistic =  ExpectedFeedbackSemanticStatistic.emptyScores(
                expectedEmbedding.id,
                expectedEmbedding.metric,
                expectedEmbedding.sentence
            )

            for (const generatedEmbeddingIndex in generatedEmbeddings) {

                const generatedEmbedding = generatedEmbeddings[generatedEmbeddingIndex];
                if(generatedEmbedding.index !== undefined && expectedEmbedding.index !== undefined) {
                    if(generatedEmbedding.metric === expectedEmbedding.metric) {
                        const score = similarityScores[expectedEmbedding.index][generatedEmbedding.index];
                        this.addScoreToExpectedStatistic(
                            expectedStatistic,
                            generatedEmbedding,
                            score
                        );
                        this.addScoreToGeneratedStatistic(
                            expectedEmbedding,
                            generatedEmbedding,
                            generatedFeedbackStatistics,
                            score
                        );
                    }
                }
            }
            this.sortExpectedScoresDescending(expectedStatistic);
            expectedFeedbackStatistics.push(expectedStatistic);
        }

        return new EvaluationSemanticStatistic(
            expectedFeedbackStatistics,
            this.convertGeneratedFeedbackMapToArray(generatedFeedbackStatistics)
        );
    }

    private convertGeneratedFeedbackMapToArray(
        generatedFeedbackStatistics: Map<number, GeneratedFeedbackSemanticStatistic>
    ): GeneratedFeedbackSemanticStatistic[] {
        return Array.from(generatedFeedbackStatistics.entries())
            .sort((a, b) => a[0] - b[0])  // sort by key (number)
            .map(([_, value]) => value);
    }

    private addScoreToExpectedStatistic(
        expectedSemantic: ExpectedFeedbackSemanticStatistic,
        generatedEmbedding: GeneratedFeedbackEmbedding,
        score: number
    ) {
        if(score > this.SCORE_THRESHOLD) {
            const generatedScore = new ExpectedFeedbackSemanticScore(
                generatedEmbedding.sentence,
                score
            );
            expectedSemantic.scores.push(generatedScore);
        }
    }

    private addScoreToGeneratedStatistic(
        expectedEmbedding: ExpectedFeedbackEmbedding,
        generatedEmbedding: GeneratedFeedbackEmbedding,
        generatedFeedbackStatistics: Map<number, GeneratedFeedbackSemanticStatistic>,
        score: number
    ) {
        const index = generatedEmbedding.index!;
        if(generatedFeedbackStatistics.has(index)) {
            this.updateGeneratedFeedbackStatistic(
                expectedEmbedding,
                generatedFeedbackStatistics.get(index)!,
                score
            )
        } else {
            this.createGeneratedFeedbackStatistic(
                expectedEmbedding,
                generatedEmbedding,
                score,
                index,
                generatedFeedbackStatistics
            )
        }
    }

    private updateGeneratedFeedbackStatistic(
        expectedEmbedding: ExpectedFeedbackEmbedding,
        generatedStatistic: GeneratedFeedbackSemanticStatistic,
        score: number
    ): void {
        if(score > generatedStatistic.scores[0].score) {
            generatedStatistic.scores[0] = this.createGeneratedSemanticWithScore(expectedEmbedding, score);
        }
    }

    private createGeneratedFeedbackStatistic(
        expectedEmbedding: ExpectedFeedbackEmbedding,
        generatedEmbedding: GeneratedFeedbackEmbedding,
        score: number,
        index: number,
        generatedFeedbackStatistics: Map<number, GeneratedFeedbackSemanticStatistic>,
    ): void {
        generatedFeedbackStatistics.set(
            index,
            new GeneratedFeedbackSemanticStatistic(
                generatedEmbedding.sentence,
                [this.createGeneratedSemanticWithScore(expectedEmbedding, score)]
            )
        );
    }

    private createGeneratedSemanticWithScore(
        expectedEmbedding: ExpectedFeedbackEmbedding,
        score: number
    ): GeneratedFeedbackSemanticScore {
        return new GeneratedFeedbackSemanticScore(
            expectedEmbedding.id,
            expectedEmbedding.sentence,
            score
        )
    }

    private sortExpectedScoresDescending(generatedSemantic: ExpectedFeedbackSemanticStatistic): void {
        generatedSemantic.scores.sort((score1, score2) =>
            score2.score - score1.score
        );
    }
}