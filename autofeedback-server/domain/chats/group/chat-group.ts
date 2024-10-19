import {Document, model, Schema} from "mongoose";
import {IPromptGroup, promptGroup} from "../../prompts/promptGroup";
import {IExercise, exerciseSchema} from "../../exercises/exercise";
import Entity from "../../entities/entity";
import EntityUtil from "../../entities/entity";

export interface IChatGroup {
    name: string,
    promptGroup: IPromptGroup,
    exercise: IExercise,
    attempt: string,
}

export class ChatGroup implements IChatGroup, Entity {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly promptGroup: IPromptGroup,
        public readonly exercise: IExercise,
        public readonly attempt: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {
    }

    public static ofDocument(chatGroup: ChatGroupDocument) {
        const [createdAt, updatedAt] = EntityUtil.checkForProperties(chatGroup);

        return new ChatGroup(
            EntityUtil.convertId(chatGroup._id),
            chatGroup.name,
            chatGroup.promptGroup,
            chatGroup.exercise,
            chatGroup.attempt,
            createdAt,
            updatedAt
        )
    }
}

export const chatGroupSchema = new Schema<IChatGroup>(
    {
        name: { type: String, required: true },
        promptGroup: { type: promptGroup, required: true },
        exercise: { type: exerciseSchema, required: true },
        attempt: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

export type ChatGroupDocument = Document<unknown, {}, IChatGroup> & IChatGroup & {};
export const ChatGroupModel = model<IChatGroup>('ChatGroup', chatGroupSchema);