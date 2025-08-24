import Exercise from "../exercises/exercise";
import ExpectedFeedback from "./expected-feedback/expected-feedback";
import AttemptComplexity from "./attempt-complexity";

export default class Attempt {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly exercise: Exercise,
        public readonly complexity: AttemptComplexity,
        public readonly attempt: string,
        public readonly expectedFeedback: ExpectedFeedback,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}
}