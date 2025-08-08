import ExpectedFeedback from "../attempts/expected-feedback/expected-feedback";
import EvaluationSemanticStatistic from "../evaluations/statistic/evaluation-semantic-statistic";

export default interface SemanticEvaluatorClient {
    evaluate(llmFeedback: string, expectedFeedback: ExpectedFeedback): Promise<EvaluationSemanticStatistic>
}