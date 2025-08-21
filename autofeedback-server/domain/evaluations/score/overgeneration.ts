import {Schema} from "mongoose";
import OvergenerationValidity from "./overgeneration-validity";

interface IOvergeneration {
    generatedFeedbackIndex: number,
    sentence: string,
    validity: OvergenerationValidity
}

export default class Overgeneration implements IOvergeneration {
    constructor(
        public readonly generatedFeedbackIndex: number,
        public readonly sentence: string,
        public readonly validity: OvergenerationValidity
    ) {}
}

export const overgenerationSchema = new Schema<IOvergeneration>(
    {
        generatedFeedbackIndex: { type: Number, required: true },
        sentence: { type: String, required: true },
        validity: { type: String, required: true },
    },
    {
        _id: false,
        timestamps: false
    }
);