export default class ChatGroupUpdate {

    constructor(
        public readonly name: string,
        public readonly exerciseId: string,
        public readonly promptGroupId: string,
        public readonly attempt: string,
    ) {
    }
}