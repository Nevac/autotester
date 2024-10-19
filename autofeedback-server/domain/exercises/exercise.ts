import {Document, model, Schema} from "mongoose";
import Entity from "../entities/entity";
import EntityUtil from "../entities/entity";

export interface IExercise {
    name: string,
    task: string,
    solution: string
}

export class Exercise implements IExercise, Entity {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly task: string,
        public readonly solution: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {
    }

    public static ofDocument(exercise: ExerciseDocument): Exercise {
        const [createdAt, updatedAt] = EntityUtil.checkForProperties(exercise)

        return new Exercise(
            EntityUtil.convertId(exercise._id),
            exercise.name,
            exercise.task,
            exercise.solution,
            createdAt,
            updatedAt
        )
    }
}

export const exerciseSchema = new Schema<IExercise>(
    {
        name: { type: String, required: true },
        task: { type: String, required: true },
        solution: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

export type ExerciseDocument = Document<unknown, {}, IExercise> & IExercise & {};
export const ExerciseModel = model<IExercise>('Exercise', exerciseSchema);