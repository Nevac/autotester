import {Exercise} from "../exercises/exercise";
import PromptGroup from "../prompts/prompt-group";
import ExpectedFeedback from "./expected-feedback/expected-feedback";
import AttemptComplexity from "./attempt-complexity";

export default class AttemptUpdate {
    constructor(
        public readonly name: string,
        public readonly exercise: Exercise,
        public readonly complexity: AttemptComplexity,
        public readonly attempt: string,
        public readonly expectedFeedback: ExpectedFeedback
    ) {
    }
}