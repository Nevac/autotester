import { Schema, model } from 'mongoose';
import {Exercise, exerciseSchema} from "../exercises/exercise";
import {PromptGroup, promptGroup} from "../prompts/promptGroup";
import {Llm, llmSchema} from "../llms/llm";

export interface Chat {
    name: String,
    chatGroupId: String,
    model: Llm,
    exercise: Exercise,
    prompts: PromptGroup,
    attempt: String,
    feedback: String
}

const chatSchema = new Schema<Chat>({
    name: { type: String, required: true },
    chatGroupId: { type: String, required: true },
    model: { type: llmSchema, required: true },
    exercise: { type: exerciseSchema, required: true },
    prompts: { type: promptGroup, required: true },
    attempt: { type: String, required: true },
    feedback: { type: String, required: true },
});

export const ChatModel = model<Chat>('Chat', chatSchema);