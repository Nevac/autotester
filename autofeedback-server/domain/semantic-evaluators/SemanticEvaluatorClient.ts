import ExpectedFeedback from "../attempts/expected-feedback/expected-feedback";

export default interface SemanticEvaluatorClient {
    evaluate(llmFeedback: string, expectedFeedback: ExpectedFeedback): Promise<number>
}