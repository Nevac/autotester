import {Llm} from "../llms/llm";

export class ChatListItem {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly model: Llm,
        public readonly createdAt: Date
    ) {}
}