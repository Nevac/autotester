import {Exercise} from "../../exercises/exercise";
import PromptGroup from "../../prompts/promptGroup";

export default class ChatGroupUpdate {
    constructor(
        public readonly name: string,
        public readonly exercise: Exercise,
        public readonly attempt: string,
        public readonly promptGroup: PromptGroup
    ) {
    }
}