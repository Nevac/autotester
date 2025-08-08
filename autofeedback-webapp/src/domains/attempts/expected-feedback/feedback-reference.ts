import FeedbackMetric from "./feedback-metric";

export default class FeedbackReference {
    constructor(
        public readonly id: string,
        public readonly references: string[],
        public readonly metric: FeedbackMetric
    ) {}
}