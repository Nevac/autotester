import EvaluationGroupStatistic from "./evaluation-group-statistic";
import {EvaluationGroup} from "../evaluation-group";
import ScoreDelta from "./score-delta";
import {Llm} from "../../../llms/llm";
import EvaluationGroupStatKey from "./evaluation-group-stat-key";
import ScoreDeltaData from "./score-delta-data";

export default class StatisticGenerator {

    public static generate(
        evaluationGroupBase: EvaluationGroup,
        evaluationGroupBaseCompares: EvaluationGroup[]
    ): EvaluationGroupStatistic {
        return new StatisticGenerator().generate(
            evaluationGroupBase,
            evaluationGroupBaseCompares
        );
    }

    public generate(
        evaluationGroupBase: EvaluationGroup,
        evaluationGroupCompares: EvaluationGroup[]
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

        return new EvaluationGroupStatistic(
            evaluationGroupBase,
            evaluationGroupCompares,
            llmOccurance.occuring,
            llmOccurance.nonOccuring,
            scoreDelta
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