import EntityUtil from "../entities/entity";
import {PromptGroupDocument} from "./prompt-group";

export default class PromptGroupListEntry {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly createdAt: Date
    ) {
    }

    public static ofDocument(exercise: PromptGroupDocument): PromptGroupListEntry {
        const [createdAt, _] = EntityUtil.checkForProperties(exercise);

        return new PromptGroupListEntry(
            EntityUtil.convertId(exercise._id),
            exercise.name,
            createdAt
        )
    }
}