import PromptGroup from "../../prompts/groups/prompt-group";
import Exercise from "../../exercises/exercise";

export class ChatGroup {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly promptGroup: PromptGroup,
        public readonly exercise: Exercise,
        public readonly attempt: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}
}