import Model from "../llms/llm";
import Exercise from "../exercises/exercise";
import { Schema, model } from 'mongoose';
import Llm from "../llms/llm";
import Prompts from "../prompts/prompts";

interface Chat {
    name: String,
    chatGroupId: String,
    model: Llm,
    exercise: Exercise,
    prompts: Prompts,
    attempt: String,
    feedback: String
}

const chatSchema = new Schema<Chat>({
    name: { type: String, required: true },
    chatGroupId: { type: String, required: true },
    model: { type: Model, required: true },
    exercise: { type: Exercise, required: true },
    prompts: { type: Prompts, required: true },
    attempt: { type: String, required: true },
    feedback: { type: String, required: true },
});

const Chat = model<Chat>('Chat', chatSchema);

export default Chat;