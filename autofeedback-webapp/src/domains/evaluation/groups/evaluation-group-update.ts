export default class EvaluationGroupUpdate {
    constructor(
        public readonly name: string,
        public readonly promptGroupId: string,
        public readonly attemptIds: string[],
        public readonly llms: string[],
        public readonly astEnabled: boolean,
        public readonly ragClientId?: string,
        public readonly ragStaticId?: string,
    ) {}
}