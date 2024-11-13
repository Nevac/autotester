import Exercise from "../exercises/exercise";
import PromptGroup from "../prompts/groups/prompt-group";
import {Llm} from "../llms/llm";

export class Chat {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly chatGroupId: string,
        public readonly model: Llm,
        public readonly exercise: Exercise,
        public readonly promptGroup: PromptGroup,
        public readonly attempt: string,
        public readonly feedback: string[],
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}
}