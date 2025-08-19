import PromptGroup from "../../prompts/prompt-group";
import {Attempt} from "../../attempts/attempt";
import EvaluationGroupLlm from "./llm/evaluation-group-llm";
import EvaluationState from "../evaluation-state";
import Rag from "../../rag/rag";
import {EvaluationGroup} from "./evaluation-group";
import {Llm} from "../../llms/llm";

export default class EvaluationGroupUpsert {
    bestLlm?: Llm;
    bestScore?: number;

    constructor(
        public name: string,
        public promptGroup: PromptGroup,
        public attempts: Attempt[],
        public llms: Map<string, EvaluationGroupLlm>,
        public state: EvaluationState,
        public astEnabled: boolean,
        public rag?: Rag
    ) {}

    public static ofEvaluationGroup(evaluationGroup: EvaluationGroup): EvaluationGroupUpsert {
        return new EvaluationGroupUpsert(
            evaluationGroup.name,
            evaluationGroup.promptGroup,
            Array.from(evaluationGroup.attempts),
            evaluationGroup.llms,
            evaluationGroup.state,
            evaluationGroup.astEnabled,
            evaluationGroup.rag
        )
    }

    public setState(state: EvaluationState): EvaluationGroupUpsert {
        this.state = state;
        return this;
    }

    public setLlms(llms: Map<Llm, EvaluationGroupLlm>): EvaluationGroupUpsert {
        this.llms = llms;
        return this;
    }

    public setBestLlm(llm?: Llm): EvaluationGroupUpsert {
        this.bestLlm = llm;
        return this;
    }

    public setBestScore(bestScore: number): EvaluationGroupUpsert {
        this.bestScore = bestScore;
        return this;
    }
}