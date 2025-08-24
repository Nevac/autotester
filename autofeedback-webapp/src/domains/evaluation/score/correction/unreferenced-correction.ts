import FeedbackMetric from "../../../attempts/expected-feedback/feedback-metric";

export default class UnreferencedCorrection {
    constructor(
        public generatedFeedbackIndex: number,
        public metric: FeedbackMetric,
        public ignore: boolean
    ) {}

    public setIgnore(value: boolean): UnreferencedCorrection {
        this.ignore = value;
        return this;
    }
}