import {model, Schema} from "mongoose";

const exerciseSchema = new Schema({
    name: { type: String, required: true },
    task: { type: String, required: true },
    solution: { type: String, required: true },
});

const Exercise = model('Exercise', exerciseSchema);

export default Exercise;