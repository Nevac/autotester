import {model, Schema} from "mongoose";

interface Prompts {
    prompts: String[]
}

const promptsSchema = new Schema<Prompts>({
    prompts: { type: [String], required: true },
});

const Prompts = model<Prompts>('Prompts', promptsSchema);

export default Prompts;