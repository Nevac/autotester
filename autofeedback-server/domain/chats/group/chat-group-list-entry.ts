import EntityUtil from "../../entities/entity";
import {ChatGroupDocument} from "./chat-group";

export default class ChatGroupListEntry {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly exercise: string,
        public readonly promptGroup: string,
        public readonly createdAt: Date
    ) {
    }

    public static ofDocument(chatGroup: ChatGroupDocument): ChatGroupListEntry {
        const [createdAt, _] = EntityUtil.checkForProperties(chatGroup);

        return new ChatGroupListEntry(
            EntityUtil.convertId(chatGroup._id),
            chatGroup.name,
            chatGroup.exercise.name,
            chatGroup.promptGroup.name,
            createdAt
        )
    }
}