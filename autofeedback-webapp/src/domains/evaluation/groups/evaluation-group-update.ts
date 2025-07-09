import {Llm} from "../../llms/llm";

export default class EvaluationGroupUpdate {

    constructor(
        public readonly name: string,
        public readonly promptGroupId: string,
        public readonly attemptIds: string[],
        public readonly llms: string[],
        public readonly ragId?: string
    ) {
    }
}