import Embedding from "./embedding";
import FeedbackMetric from "../../../attempts/expected-feedback/feedback-metric";

export default class GeneratedFeedbackEmbedding implements Embedding {
    constructor(
        public readonly sentence: string,
        public readonly metric: FeedbackMetric,
        public index?: number,
    ) {}
}