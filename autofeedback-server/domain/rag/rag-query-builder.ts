import {Evaluation} from "../evaluations/evaluation";

export default class RagQueryBuilder {

    public static ofEvaluation(evaluation: Evaluation): string {
        return `
            Task:
            ${evaluation.attempt.exercise.task}
            
            -------
            Example Solution:
            ${evaluation.attempt.exercise.solution}
            
            -------
            Attempt:
            ${evaluation.attempt.attempt}
        `
    }
}