import {Document, model, Schema} from "mongoose";
import EntityUtil from "../entities/entity";

export interface ILlm {
    name: string,
    logoUrl: string,
}

export class Llm implements ILlm {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly logoUrl: string
    ) {}

    public static ofDocument(llm: LlmDocument) {
        return new Llm(
            EntityUtil.convertId(llm._id),
            llm.name,
            llm.logoUrl
        )
    }
}

export const llmSchema = new Schema<ILlm>({
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
});

export type LlmDocument = Document<unknown, {}, ILlm> & ILlm & {};
export const LlmModel = model<ILlm>('Llm', llmSchema);