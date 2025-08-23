import {EvaluationScoreCorrection} from "./evaluation-score-correction";

export default class CorrectScoreDto {
    constructor(
        evaluationId: string,
        correction: EvaluationScoreCorrection
    ) {}
}