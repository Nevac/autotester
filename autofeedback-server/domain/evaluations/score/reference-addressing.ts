import MetricBestHit from "./metric-best-hit";
import {Schema} from "mongoose";

interface IReferenceAddressing {
    id: string,
    addressed: boolean,
    expectedSentence: string,
    generatedSentence: string,
    similarityScore: number
}

export default class ReferenceAddressing implements IReferenceAddressing {
    constructor(
        public readonly id: string,
        public readonly addressed: boolean,
        public readonly expectedSentence: string,
        public readonly generatedSentence: string,
        public readonly similarityScore: number
    ) {}
}

export const referenceAddressingSchema = new Schema<IReferenceAddressing>(
    {
        id: { type: String, required: true },
        addressed: { type: Boolean, required: true },
        expectedSentence: { type: String, required: true },
        generatedSentence: { type: String, required: true },
        similarityScore: { type: Number, required: true },
    },
    {
        _id: false,
        timestamps: false
    }
);