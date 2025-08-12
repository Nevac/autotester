import EvaluationSemanticStatistic from "../evaluation-semantic-statistic";
import GeneratedFeedbackSemanticStatistic from "../generated-feedback-semantic-statistic";
import ExpectedFeedbackSemanticStatistic from "../expected-feedback-semantic-statistic";
import ExpectedFeedbackSemanticScore from "../expected-feedback-semantic-score";
import GeneratedFeedbackSemanticScore from "../generated-feedback-semantic-score";
import ExpectedFeedbackEmbedding from "./expected-feedback-embedding";
import GeneratedFeedbackEmbedding from "./generated-feedback-embedding";
import SCORE_THRESHOLD from "../../score/score-threshold";

export default class SemanticStatisticGenerator {

    public static generate(
        expectedEmbeddings: ExpectedFeedbackEmbedding[],
        generatedEmbeddings: GeneratedFeedbackEmbedding[],
        similarityScores: number[][]
    ): EvaluationSemanticStatistic {
        return new SemanticStatisticGenerator()
            .generateEvaluationStatistics(
                expectedEmbeddings,
                generatedEmbeddings,
                similarityScores
            );
    }

    public generateEvaluationStatistics(
        expectedEmbeddings: ExpectedFeedbackEmbedding[],
        generatedEmbeddings: GeneratedFeedbackEmbedding[],
        similarityScores: number[][]
    ): EvaluationSemanticStatistic {
        const generatedFeedbackStatistics: Map<number, GeneratedFeedbackSemanticStatistic> = new Map();
        const expectedFeedbackStatistics: ExpectedFeedbackSemanticStatistic[] = [];

        for(const generatedEmbeddingIndex in generatedEmbeddings) {
            const generatedIndex = parseInt(generatedEmbeddingIndex);
            const generatedEmbedding = generatedEmbeddings[generatedIndex];

            generatedFeedbackStatistics.set(
                generatedIndex,
                new GeneratedFeedbackSemanticStatistic(
                    generatedEmbedding.sentence,
                    generatedEmbedding.metric,
                    []
                )
            );
        }

        for (const expectedEmbeddingIndex in expectedEmbeddings) {
            const expectedIndex = parseInt(expectedEmbeddingIndex);


            const expectedEmbedding = expectedEmbeddings[expectedIndex];
            const expectedStatistic =  ExpectedFeedbackSemanticStatistic.emptyScores(
                expectedEmbedding.id,
                expectedEmbedding.metric,
                expectedEmbedding.sentence
            )

            for (const generatedEmbeddingIndex in generatedEmbeddings) {
                const generatedIndex = parseInt(generatedEmbeddingIndex);
                const generatedEmbedding = generatedEmbeddings[generatedIndex];

                const score = similarityScores[expectedIndex][generatedIndex];
                if(generatedEmbedding.metric === expectedEmbedding.metric) {
                    this.addScoreToExpectedStatistic(
                        expectedStatistic,
                        generatedEmbedding,
                        score
                    );
                    this.addScoreToGeneratedStatistic(
                        expectedEmbedding,
                        generatedEmbedding,
                        generatedIndex,
                        generatedFeedbackStatistics,
                        score
                    );
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
        if(score > SCORE_THRESHOLD) {
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
        generatedEmbeddingIndex: number,
        generatedFeedbackStatistics: Map<number, GeneratedFeedbackSemanticStatistic>,
        score: number
    ) {
        if(generatedFeedbackStatistics.has(generatedEmbeddingIndex)) {
            this.updateGeneratedFeedbackStatistic(
                expectedEmbedding,
                generatedFeedbackStatistics.get(generatedEmbeddingIndex)!,
                score
            )
        } else {
            this.createGeneratedFeedbackStatistic(
                expectedEmbedding,
                generatedEmbedding,
                score,
                generatedEmbeddingIndex,
                generatedFeedbackStatistics
            )
        }
    }

    private updateGeneratedFeedbackStatistic(
        expectedEmbedding: ExpectedFeedbackEmbedding,
        generatedStatistic: GeneratedFeedbackSemanticStatistic,
        score: number
    ): void {
        if(generatedStatistic.scores.length === 0) {
            generatedStatistic.scores.push(this.createGeneratedSemanticWithScore(expectedEmbedding, score));
        } else if(score > generatedStatistic.scores[0].score) {
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
                generatedEmbedding.metric,
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