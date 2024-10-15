import {model, Schema} from "mongoose";

interface Exercise {
    name: String,
    task: String,
    solution: String
}

const exerciseSchema = new Schema<Exercise>({
    name: { type: String, required: true },
    task: { type: String, required: true },
    solution: { type: String, required: true },
});

const Exercise = model<Exercise>('Exercise', exerciseSchema);

export default Exercise;