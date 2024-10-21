import {Document, model, Schema} from "mongoose";
import Entity from "../entities/entity";
import EntityUtil from "../entities/entity";

export interface IPromptGroup {
    name: string,
    prompts: string[]
}

export default class PromptGroup implements IPromptGroup, Entity {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly prompts: string[],
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {
    }

    public static ofDocument(promptGroup: PromptGroupDocument) {
        const [createdAt, updatedAt] = EntityUtil.checkForProperties(promptGroup)

        return new PromptGroup(
            Entity.convertId(promptGroup._id),
            promptGroup.name,
            promptGroup.prompts,
            createdAt,
            updatedAt
        )
    }
}

export const promptGroup = new Schema<IPromptGroup>(
    {
        name: { type: String, required: true },
        prompts: {type: [String]}
    },
    {
        timestamps: true
    }
);

export type PromptGroupDocument = Document<unknown, {}, IPromptGroup> & IPromptGroup & {};
export const PromptGroupModel = model<IPromptGroup>('PromptGroup', promptGroup);
