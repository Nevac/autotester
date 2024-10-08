import Model from "../model/model";
import PromptChain from "../prompt/chain/prompt-chain";
import Message from "../message/message";

export default class Chat {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly model: Model,
        public readonly exerciseId: string,
        public readonly promptChain: PromptChain,
        public readonly messages: Message[],
        public readonly createdAt: Date,
        public readonly modifiedAt: Date,
    ) {
    }
}