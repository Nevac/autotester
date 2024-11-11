import {ILlm} from "../llms/llm";

export default class ChatUpdateDto {
    constructor(
        public readonly name: string,
        public readonly chatGroupId: string,
        public readonly modelId: string
    ) {
    }
}