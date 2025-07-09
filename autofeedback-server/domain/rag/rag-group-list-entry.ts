import EntityUtil from "../entities/entity";
import {RagDocument} from "./rag";

export default class RagGroupListEntry {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly createdAt: Date
    ) {
    }

    public static ofDocument(exercise: RagDocument): RagGroupListEntry {
        const [createdAt, _] = EntityUtil.checkForProperties(exercise);

        return new RagGroupListEntry(
            EntityUtil.convertId(exercise._id),
            exercise.name,
            createdAt
        )
    }
}