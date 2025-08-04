import ExpectedFeedback from "./expected-feedback/expected-feedback";

export default class AttemptUpdateDto {
    constructor(
        public readonly name: string,
        public readonly exerciseId: string,
        public readonly attempt: string,
        public readonly expectedFeedback: ExpectedFeedback
    ) {}
}