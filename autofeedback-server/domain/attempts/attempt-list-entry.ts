import {AttemptDocument} from "./attempt";
import EntityUtil from "../entities/entity";

export default class AttemptListEntry {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly exercise: string,
        public readonly createdAt: Date
    ) {
    }

    public static ofDocument(attempt: AttemptDocument): AttemptListEntry {
        const [createdAt, _] = EntityUtil.checkForProperties(attempt);

        return new AttemptListEntry(
            EntityUtil.convertId(attempt._id),
            attempt.name,
            attempt.exercise.name,
            createdAt
        )
    }
}