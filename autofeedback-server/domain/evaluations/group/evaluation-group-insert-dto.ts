import {Llm} from "../../llms/llm";

export default class EvaluationGroupInsertDto {
    constructor(
        public readonly name: string,
        public readonly promptGroupId: string,
        public readonly attemptIds: Set<string>,
        public readonly llms: Set<Llm>,
        public readonly astEnabled: boolean,
        public readonly ragId?: string
    ) {
    }
}

