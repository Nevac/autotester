export default class ChatGroupCreate {

    constructor(
        public readonly task: string,
        public readonly solution: string,
        public readonly attempt: string,
        public readonly prompts: string[]
    ) {
    }
}