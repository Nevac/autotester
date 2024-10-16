import {model, Schema} from "mongoose";

export interface Exercise {
    name: String,
    task: String,
    solution: String
}

export const exerciseSchema = new Schema<Exercise>({
    name: { type: String, required: true },
    task: { type: String, required: true },
    solution: { type: String, required: true },
});

export const ExerciseModel = model<Exercise>('Exercise', exerciseSchema);

