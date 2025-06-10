import {Llm} from "../../llms/llm";

export default class EvaluationGroupUpdateDto {
    constructor(
        public readonly name: string,
        public readonly promptGroupId: string,
        public readonly attemptIds: Set<string>,
        public readonly llms: Set<Llm>
    ) {
    }
}