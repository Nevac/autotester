import ExpectedFeedback from "./expected-feedback/expected-feedback";
import AttemptComplexity from "./attempt-complexity";

export default class AttemptUpdateDto {
    constructor(
        public readonly name: string,
        public readonly exerciseId: string,
        public readonly complexity: AttemptComplexity,
        public readonly attempt: string,
        public readonly expectedFeedback: ExpectedFeedback
    ) {}
}