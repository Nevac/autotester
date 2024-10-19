export default class ChatGroupUpdateDto {
    constructor(
        public readonly name: string,
        public readonly exerciseId: string,
        public readonly attempt: string,
        public readonly promptGroupId: string
    ) {
    }
}