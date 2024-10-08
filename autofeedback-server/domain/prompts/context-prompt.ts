import {model, Schema} from "mongoose";

const contextPromptSchema = new Schema({
    prompt: { type: String, required: true },
});

const Exercise = model('ContextPrompt', contextPromptSchema);

export default Exercise;