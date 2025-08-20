import {Schema} from "mongoose";
import UnreferencedFeedback, {unassignedFeedbackSchema} from "./unreferenced-feedback";
import ReferenceAddressing, {referenceAddressingSchema} from "./reference-addressing";

interface IMetricScore {
    score: number,
    referenceAddressings: ReferenceAddressing[],
    unreferencedFeedbacks: UnreferencedFeedback[]
}

export default class MetricScore implements IMetricScore {
    constructor(
        public readonly score: number,
        public readonly referenceAddressings: ReferenceAddressing[],
        public readonly unreferencedFeedbacks: UnreferencedFeedback[]
    ) {}

    public static zero() {
        return new MetricScore(
            0,
            [],
            []
        );
    }
}

export const metricScoreSchema = new Schema<IMetricScore>(
    {
        score: { type: Number, required: true },
        referenceAddressings: { type: [referenceAddressingSchema], required: true },
        unreferencedFeedbacks: { type: [unassignedFeedbackSchema], required: true }
    },
    {
        _id: false,
        timestamps: false
    }
);