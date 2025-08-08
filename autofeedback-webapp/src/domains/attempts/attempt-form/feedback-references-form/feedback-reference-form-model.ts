import FeedbackMetric from "../../expected-feedback/feedback-metric";

export default class FeedbackReferenceFormModel {
    constructor(
        public id: string,
        public references: string[],
        public metric: FeedbackMetric
    ) {}

    public static create(metric: FeedbackMetric): FeedbackReferenceFormModel {
        return new FeedbackReferenceFormModel(
            "",
            [],
            metric
        )
    }
}