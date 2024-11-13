import {Llm} from "../llms/llm";

export default class ChatUpdate {
    constructor(
        public readonly name: string,
        public readonly chatGroupId: string,
        public readonly llm: Llm
    ) {}
}