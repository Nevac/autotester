import {model, Schema} from "mongoose";

export interface Llm {
    name: String,
    logoUrl: String,
}

export const llmSchema = new Schema<Llm>({
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
});

export const LlmModel = model<Llm>('Llm', llmSchema);