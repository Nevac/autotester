import EvaluationState from "./evaluation-state";

export class EvaluationListItem {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly sate: EvaluationState,
        public readonly score: number,
        public readonly createdAt: Date
    ) {}
}