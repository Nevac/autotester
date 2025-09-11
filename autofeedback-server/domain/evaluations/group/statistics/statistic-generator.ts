import EvaluationGroupStatistic from "./evaluation-group-statistic";
import {EvaluationGroup} from "../evaluation-group";
import ScoreDelta from "./score-delta";
import {Llm} from "../../../llms/llm";
import EvaluationGroupStatKey from "./evaluation-group-stat-key";
import ScoreDeltaData from "./score-delta-data";
import ScoreRankings from "./ranking/score-rankings";
import ScoreRanking from "./ranking/score-ranking";
import ScoreRankingEntry from "./ranking/score-ranking-entry";
import ScoreRankingAverage from "./ranking/score-ranking-average";
import AttemptScoreEntry from "./attempt/attempt-score-entry";
import AttemptScores from "./attempt/attempt-scores";
import {Attempt} from "../../../attempts/attempt";
import EvaluationService from "../../evaluation-service";
import {Evaluation} from "../../evaluation";

export default class StatisticGenerator {

    private readonly evaluationService = new EvaluationService();

    public static generate(
        evaluationGroupBase: EvaluationGroup,
        evaluationGroupBaseCompares: EvaluationGroup[],
        evaluations: Map<string, Evaluation>
    ): EvaluationGroupStatistic {
        return new StatisticGenerator().generate(
            evaluationGroupBase,
            evaluationGroupBaseCompares,
            evaluations
        );
    }

    public generate(
        evaluationGroupBase: EvaluationGroup,
        evaluationGroupCompares: EvaluationGroup[],
        evaluations: Map<string, Evaluation>
    ): EvaluationGroupStatistic {
        const llmOccurance = this.extractLlms(
            evaluationGroupBase,
            evaluationGroupCompares
        );

        const scoreDelta = this.generateDeltas(
            llmOccurance.occuring,
            evaluationGroupBase,
            evaluationGroupCompares
        );

        const rankings = this.generateRankings(
            llmOccurance.occuring,
            evaluationGroupBase,
            evaluationGroupCompares
        );

        const attemptScores = this.calculateAverageAttemptScores(
            evaluationGroupBase,
            evaluationGroupCompares,
            llmOccurance,
            evaluations
        );

        return new EvaluationGroupStatistic(
            evaluationGroupBase,
            evaluationGroupCompares,
            llmOccurance.occuring,
            llmOccurance.nonOccuring,
            scoreDelta,
            rankings,
            attemptScores
        );
    }

    private generateDeltas(
        llms: Llm[],
        evaluationGroupBase: EvaluationGroup,
        evaluationGroupCompares: EvaluationGroup[]
    ): ScoreDelta {

        const totalScoreDeltas: ScoreDeltaData[] = [];
        const correctnessDeltas: ScoreDeltaData[] = [];
        const suggestionDeltas: ScoreDeltaData[] = [];
        const codeStyleDeltas: ScoreDeltaData[] = [];
        const overgenerationDeltas: ScoreDeltaData[] = [];


        llms.forEach(llm =>
            evaluationGroupCompares.forEach(evaluationGroupCompare => {
                const delta = this.calculateDelta(
                    llm,
                    evaluationGroupBase,
                    evaluationGroupCompare
                );
                const statKey = new EvaluationGroupStatKey(
                    evaluationGroupCompare._id,
                    evaluationGroupCompare.name
                );

                totalScoreDeltas.push(new ScoreDeltaData(llm, statKey, delta.totalDelta));
                correctnessDeltas.push(new ScoreDeltaData(llm, statKey, delta.correctnessDelta));
                suggestionDeltas.push(new ScoreDeltaData(llm, statKey, delta.suggestionDelta));
                codeStyleDeltas.push(new ScoreDeltaData(llm, statKey, delta.codeStyleDelta));
                overgenerationDeltas.push(new ScoreDeltaData(llm, statKey, delta.overgenerationDelta));
            })
        )

        return new ScoreDelta(
            llms,
            evaluationGroupCompares.map(
                evaluationGroup => new EvaluationGroupStatKey(
                    evaluationGroup._id,
                    evaluationGroup.name
                )),
            totalScoreDeltas,
            correctnessDeltas,
            suggestionDeltas,
            codeStyleDeltas,
            overgenerationDeltas
        )
    }

    private generateRankings(
        llms: Llm[],
        evaluationGroupBase: EvaluationGroup,
        evaluationGroupCompares: EvaluationGroup[]
    ): ScoreRankings {
        const rankingsBase = ScoreRanking.ofEvaluation(evaluationGroupBase);
        const rankingCompareMap = new Map<string, ScoreRanking> (
            evaluationGroupCompares.map(evaluationGroup =>
                [evaluationGroup._id, ScoreRanking.ofEvaluation(evaluationGroup)]
            )
        );

        const rankingAverageMap = new Map<Llm, ScoreRankingEntry[]> (
            llms.map(llm => [llm, []])
        )

        for(const llm of llms) {
            const evalGroupLlmBase = evaluationGroupBase.llms.get(llm)!
            const scoreRankingEntryBase = ScoreRankingEntry.ofEvaluationGroupScore(evalGroupLlmBase);
            rankingsBase.rankings.push(scoreRankingEntryBase);
            rankingAverageMap.get(llm)!.push(scoreRankingEntryBase);

            for(const evaluationGroupCompare of evaluationGroupCompares) {
                const ranking = rankingCompareMap.get(evaluationGroupCompare._id)!
                const evalGroupLlm = evaluationGroupCompare.llms.get(llm)!
                const scoreRankingEntry = ScoreRankingEntry.ofEvaluationGroupScore(evalGroupLlm);
                ranking.rankings.push(scoreRankingEntry);
                rankingAverageMap.get(llm)!.push(scoreRankingEntry);
            }
        }

        rankingsBase.rankings.sort((a, b) => b.totalScore - a.totalScore);
        const rankingCompares = Array.from(rankingCompareMap.values());
        rankingCompares.forEach(
            ranking => ranking.rankings.sort((a, b) => b.totalScore - a.totalScore)
        );

        return new ScoreRankings(
            rankingsBase,
            rankingCompares,
            this.calculateAverageRanking(rankingAverageMap)
        );
    }

    private calculateAverageRanking(averageRankingsMap: Map<Llm, ScoreRankingEntry[]>): ScoreRankingAverage {
        const scoreRankingAverage = new ScoreRankingAverage([]);
        for(const [llm, scoreRankingEntries] of averageRankingsMap) {
            const entriesCount = scoreRankingEntries.length;
            let scoreRanking = ScoreRankingEntry.zero(llm);
            for(const scoreRankingEntry of scoreRankingEntries) {
                scoreRanking = scoreRanking.add(scoreRankingEntry);
            }
            scoreRanking = scoreRanking.divide(entriesCount);
            scoreRankingAverage.rankings.push(scoreRanking);
        }
        scoreRankingAverage.rankings.sort((a, b) => b.totalScore - a.totalScore);
        return scoreRankingAverage;
    }

    private calculateAverageAttemptScores(
        evaluationGroupBase: EvaluationGroup,
        evaluationGroupBaseCompares: EvaluationGroup[],
        llmOccurence: LlmOccurence,
        evaluationsMap: Map<string, Evaluation>
    ): AttemptScores {
        const llmAttemptScoreMap = this.createLlmAttemptScoreMap(
            evaluationGroupBase.attempts,
            llmOccurence
        );
        const evaluationGroups = [...evaluationGroupBaseCompares, evaluationGroupBase];
        const llmEvaluationMap = new Map<Llm, Evaluation[]>();
        for (const evaluation of Array.from(evaluationsMap.values())) {
            const llm = evaluation.llm;
            if(llmEvaluationMap.has(llm)) {
                llmEvaluationMap.get(llm)!.push(evaluation);
            } else {
                llmEvaluationMap.set(llm, [evaluation]);
            }
        }

        const groupsNumber = evaluationGroups.length;
        for(const llm of llmOccurence.occuring) {
            const attemptMap = llmAttemptScoreMap.get(llm)!;
            const evaluations = llmEvaluationMap.get(llm)!
            for(const evaluation of evaluations) {
                const attemptId = evaluation.attempt._id.toString();
                const attemptScoreEntry = attemptMap.get(attemptId)!;
                attemptMap.set(
                    attemptId,
                    attemptScoreEntry.add(
                        evaluation
                    )
                )
            }
            const attemptMapKeys = Array.from(attemptMap.keys());
            for(const attemptId of attemptMapKeys) {
                const entry = attemptMap.get(attemptId)!;
                attemptMap.set(
                    attemptId,
                    entry.divide(groupsNumber)
                );
            }
        }

        const averageAttemptScoresPerLlm = Array.from(llmAttemptScoreMap.values()).map(map => Array.from(map.values()));
        averageAttemptScoresPerLlm.sort((a, b) => a[0].llm.localeCompare(b[0].llm))
        return new AttemptScores(averageAttemptScoresPerLlm);
    }

    private createLlmAttemptScoreMap(
        attempts: Set<Attempt>,
        llmOccurence: LlmOccurence
    ): Map<Llm, Map<string, AttemptScoreEntry>> {
        const llmMap = new Map<Llm, Map<string, AttemptScoreEntry>>();
        for(const llm of llmOccurence.occuring) {
            const attemptMap = new Map<string, AttemptScoreEntry>;
            llmMap.set(llm, attemptMap);
            for(const attempt of attempts) {
                attemptMap.set(
                    attempt._id.toString(),
                    AttemptScoreEntry.zero(
                        llm,
                        attempt
                    )
                );
            }
        }
        return llmMap;
    }

    private calculateDelta(
        llm: Llm,
        evaluationGroupBase: EvaluationGroup,
        evaluationGroupCompare: EvaluationGroup
    ): Delta {
        const baseScore = evaluationGroupBase.llms.get(llm)!.score;
        const compareScore = evaluationGroupCompare.llms.get(llm)!.score;
        return new Delta(
            compareScore.total - baseScore.total,
            compareScore.correctness - baseScore.correctness,
            compareScore.suggestion - baseScore.suggestion,
            compareScore.codeStyle - baseScore.codeStyle,
            compareScore.overgeneration - baseScore.overgeneration,
        );
    }

    private extractLlms(
        evaluationGroupBase: EvaluationGroup,
        evaluationGroupBaseCompares: EvaluationGroup[]
    ): LlmOccurence {
        const evaluations = [...evaluationGroupBaseCompares];
        evaluations.push(evaluationGroupBase);
        const allEvaluationLlms = evaluations.map(evaluations => evaluations.llms);
        const allLlms = new Set<Llm>(allEvaluationLlms.map(maps =>
                Array.from(maps.keys())).flat()
        );

        const nonOccuring = new Set<Llm>();
        for(const llmMustHave of allLlms) {
            for(const evaluationLlms of allEvaluationLlms) {
                if(!evaluationLlms.has(llmMustHave)) {
                    nonOccuring.add(llmMustHave);
                }
            }
        }

        const occuring = new Set<Llm>(
            Array.from(allLlms).filter(llm => !nonOccuring.has(llm))
        );

        return new LlmOccurence(
            Array.from(occuring),
            Array.from(nonOccuring)
        );
    }


}

class LlmOccurence {
    public constructor(
        public readonly occuring: Llm[],
        public readonly nonOccuring: Llm[]
    ) {}
}

class Delta {
    public constructor(
        public readonly totalDelta: number,
        public readonly correctnessDelta: number,
        public readonly suggestionDelta: number,
        public readonly codeStyleDelta: number,
        public readonly overgenerationDelta: number
    ) {}
}