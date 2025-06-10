import {Exercise} from "../exercises/exercise";
import PromptGroup from "../prompts/prompt-group";

export default class AttemptUpdate {
    constructor(
        public readonly name: string,
        public readonly exercise: Exercise,
        public readonly attempt: string
    ) {
    }
}