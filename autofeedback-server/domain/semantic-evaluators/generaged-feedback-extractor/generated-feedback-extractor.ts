import GeneratedFeedbackByMetric from "./generated-feedback-by-metric";
import FeedbackMetric from "../../attempts/expected-feedback/feedback-metric";

type FeedbackCategory = 'correctness' | 'suggestion' | 'codeStyle';

export default class GeneratedFeedbackExtractor {
    constructor() {}


    public static extract(generatedFeedback: string): GeneratedFeedbackByMetric {
        return new GeneratedFeedbackExtractor().extract(generatedFeedback);
    }

    public extract(generatedFeedback: string): GeneratedFeedbackByMetric {
        const result: Record<FeedbackMetric, string[]> = {
            CORRECTNESS: [],
            SUGGESTION: [],
            CODE_STYLE: [],
        };

        const lines = generatedFeedback.split('\n');
        let currentMetric: FeedbackMetric | null = null;

        for (let rawLine of lines) {
            const line = rawLine.trim();

            if (/correctness/i.test(line)) {
                currentMetric = FeedbackMetric.CORRECTNESS;
                continue; // Skip the heading line
            } else if (/suggestion/i.test(line)) {
                currentMetric = FeedbackMetric.SUGGESTION;
                continue;
            } else if (/code\s*style/i.test(line)) {
                currentMetric = FeedbackMetric.CODE_STYLE;
                continue;
            }

            if (line.startsWith('-') && currentMetric) {
                result[currentMetric].push(line.slice(2).trim());
            }
        }

        return new GeneratedFeedbackByMetric()
            .set(FeedbackMetric.CORRECTNESS, result.CORRECTNESS)
            .set(FeedbackMetric.SUGGESTION, result.SUGGESTION)
            .set(FeedbackMetric.CODE_STYLE, result.CODE_STYLE);
    }
}