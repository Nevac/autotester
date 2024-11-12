import {ILlm} from "../llms/llm-obsolete";
import {ExerciseDocument} from "../exercises/exercise";
import EntityUtil from "../entities/entity";
import {ChatDocument} from "./chat";

export class ChatListEntry {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly model: ILlm,
        public readonly createdAt: Date
    ) {
    }

    public static ofDocument(chat: ChatDocument): ChatListEntry {
        const [createdAt, _] = EntityUtil.checkForProperties(chat);

        return new ChatListEntry(
            EntityUtil.convertId(chat._id),
            chat.name,
            chat.model,
            createdAt
        )
    }
}