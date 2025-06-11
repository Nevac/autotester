export default class AttemptUpdate {
    constructor(
        public readonly name: string,
        public readonly exerciseId: string,
        public readonly attempt: string,
        public readonly expectedFeedback: string,
    ) {
    }
}