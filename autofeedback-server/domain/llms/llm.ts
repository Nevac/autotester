import {model, Schema} from "mongoose";

interface Llm {
    name: String,
    logoUrl: String,
}

const llmSchema = new Schema<Llm>({
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
});

const Llm = model<Llm>('Llm', llmSchema);

export default Llm;