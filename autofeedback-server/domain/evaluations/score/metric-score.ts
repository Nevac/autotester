import {Schema} from "mongoose";
import MetricWrongHit, {metricWrongHitSchema} from "./metric-wrong-hit";
import ReferenceAddressing, {referenceAddressingSchema} from "./reference-addressing";

interface IMetricScore {
    score: number,
    referenceAddressings: ReferenceAddressing[],
    wrongHits: MetricWrongHit[]
}

export default class MetricScore implements IMetricScore {
    constructor(
        public readonly score: number,
        public readonly referenceAddressings: ReferenceAddressing[],
        public readonly wrongHits: MetricWrongHit[]
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
        wrongHits: { type: [metricWrongHitSchema], required: true }
    },
    {
        _id: false,
        timestamps: false
    }
);