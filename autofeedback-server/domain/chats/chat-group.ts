import Exercise from "../exercises/exercise";
import ContextPrompt from "../prompts/prompts";
import {model, Schema} from "mongoose";

const chatGroupSchema = new Schema({
    name: { type: String, required: true },
    contextPrompt: { type: ContextPrompt, required: true },
    exercise: { type: Exercise, required: true },
    attempt: { type: String, required: true },
});

const ChatGroup = model('ChatGroup', chatGroupSchema);

export default ChatGroup;