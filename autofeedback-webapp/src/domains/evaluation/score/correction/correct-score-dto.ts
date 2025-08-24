import {EvaluationScoreCorrection} from "./evaluation-score-correction";

export default class CorrectScoreDto {
    constructor(
        public evaluationId: string,
        public correction: EvaluationScoreCorrection
    ) {}
}