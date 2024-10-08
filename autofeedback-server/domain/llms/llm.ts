import {model, Schema} from "mongoose";

const llmSchema = new Schema({
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
});

const Llm = model('Llm', llmSchema);

export default Llm;