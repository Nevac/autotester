import {Exercise} from "../exercises/exercise";
import PromptGroup from "../prompts/prompt-group";
import {Llm} from "../llms/llm";


export default class ChatUpdate {
    constructor(
        public readonly name: string,
        public readonly chatGroupId: string,
        public readonly model: Llm,
        public readonly exercise: Exercise,
        public readonly promptGroup: PromptGroup,
        public readonly attempt: string,
        public readonly feedback: string[],
    ) {
    }
}