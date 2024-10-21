export default class PromptGroup {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly prompts: string[]
    ) {
    }
}