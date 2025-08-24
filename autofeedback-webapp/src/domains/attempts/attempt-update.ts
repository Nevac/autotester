import ExpectedFeedback from "./expected-feedback/expected-feedback";

export default class AttemptUpdate {
    constructor(
        public readonly name: string,
        public readonly exerciseId: string,
        public readonly complexity: AttemptComplexity,
        public readonly attempt: string,
        public readonly expectedFeedback: ExpectedFeedback,
    ) {
    }
}