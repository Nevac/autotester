import {model, Schema} from "mongoose";
import {PromptGroup, promptGroup} from "../../prompts/promptGroup";
import {Exercise, exerciseSchema} from "../../exercises/exercise";

export interface ChatGroup {
    name: String,
    promptGroup: PromptGroup,
    exercise: Exercise,
    attempt: String,
}

export const chatGroupSchema = new Schema<ChatGroup>({
    name: { type: String, required: true },
    promptGroup: { type: promptGroup, required: true },
    exercise: { type: exerciseSchema, required: true },
    attempt: { type: String, required: true },
});

export const ChatGroupModel = model<ChatGroup>('ChatGroup', chatGroupSchema);

export default ChatGroupModel;