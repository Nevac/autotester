import {ExerciseDocument} from "../../exercises/exercise";
import EntityUtil from "../../entities/entity";

export default class ChatGroupListEntry {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly createdAt: Date
    ) {
    }

    public static ofDocument(exercise: ExerciseDocument): ChatGroupListEntry {
        const [createdAt, _] = EntityUtil.checkForProperties(exercise);

        return new ChatGroupListEntry(
            EntityUtil.convertId(exercise._id),
            exercise.name,
            createdAt
        )
    }
}