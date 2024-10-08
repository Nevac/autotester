import Model from "../llms/llm";
import ContextPrompt from "../prompts/context-prompt";
import Exercise from "../exercises/exercise";
import { Schema, model } from 'mongoose';

const chatSchema = new Schema({
    name: { type: String, required: true },
    chatGroupId: { type: String, required: true },
    model: { type: Model, required: true },
    exercise: { type: Exercise, required: true },
    contextPrompt: { type: ContextPrompt, required: true },
    attempt: { type: String, required: true },
    feedback: { type: String, required: true },
});

const Chat = model('Chat', chatSchema);

export default Chat;