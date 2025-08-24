import FeedbackMetric from "../../../attempts/expected-feedback/feedback-metric";

export default class ReferencedCorrection {
    constructor(
        public id: string,
        public metric: FeedbackMetric,
        public ignore: boolean
    ) {}

    public setIgnore(value: boolean): ReferencedCorrection {
        this.ignore = value;
        return this;
    }
}