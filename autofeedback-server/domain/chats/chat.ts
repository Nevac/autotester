import {Schema, model, Document} from 'mongoose';
import {IExercise, exerciseSchema, Exercise} from "../exercises/exercise";
import PromptGroup, {IPromptGroup, promptGroupSchema} from "../prompts/prompt-group";
import {ILlm, Llm, llmSchema} from "../llms/llm";
import Entity from "../entities/entity";
import EntityUtil from "../entities/entity";

export interface IChat {
    name: string,
    chatGroupId: string,
    model: Llm,
    exercise: Exercise,
    promptGroup: PromptGroup,
    attempt: string,
    feedback: string[]
}

export class Chat implements IChat, Entity{
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

    public static ofDocument(chat: ChatDocument) {
        const [createdAt, updatedAt] = EntityUtil.checkForProperties(chat);

        return new Chat(
            EntityUtil.convertId(chat._id),
            chat.name,
            chat.chatGroupId,
            chat.model,
            chat.exercise,
            chat.promptGroup,
            chat.attempt,
            chat.feedback,
            createdAt,
            updatedAt
        )
    }
}

export const chatSchema = new Schema<IChat>(
    {
        name: { type: String, required: true },
        chatGroupId: { type: String, required: true },
        model: { type: llmSchema, required: true },
        exercise: { type: exerciseSchema, required: true },
        promptGroup: { type: promptGroupSchema, required: true },
        attempt: { type: String, required: true },
        feedback: { type: [String], required: true }
    },
    {
        timestamps: true
    }
);

export type ChatDocument = Document<unknown, {}, IChat> & IChat & {};
export const ChatModel = model<IChat>('Chat', chatSchema);