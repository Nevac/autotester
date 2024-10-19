import {ExerciseDocument} from "./exercise";
import EntityUtil from "../entities/entity";

export default class ExerciseListEntry {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly createdAt: Date
    ) {
    }

    public static ofDocument(exercise: ExerciseDocument): ExerciseListEntry {
        const [createdAt, _] = EntityUtil.checkForProperties(exercise);

        return new ExerciseListEntry(
            EntityUtil.convertId(exercise._id),
            exercise.name,
            createdAt
        )
    }
}