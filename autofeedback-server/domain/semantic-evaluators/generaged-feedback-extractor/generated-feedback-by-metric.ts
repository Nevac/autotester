import FeedbackMetric from "../../attempts/expected-feedback/feedback-metric";

export default class GeneratedFeedbackByMetric {
    constructor(
        public readonly map = new Map<FeedbackMetric, string[]>()
    ) {}

    public set(metric: FeedbackMetric, feedbacks: string[]): GeneratedFeedbackByMetric {
        this.map.set(metric, feedbacks);
        return this;
    }

    public get(metric: FeedbackMetric): string[] {
        if(this.map.has(metric)) {
            return this.map.get(metric)!;
        }
        throw new Error("Metric not found in map")
    }
}