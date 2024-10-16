import {model, Schema} from "mongoose";

export interface PromptGroup {
    name: string,
    prompts: string[]
}

export const promptGroup = new Schema<PromptGroup>({
    name: { type: String, required: true },
    prompts: [{ type: [String]}],
});

export const PromptGroupModel = model<PromptGroup>('PromptGroup', promptGroup);
