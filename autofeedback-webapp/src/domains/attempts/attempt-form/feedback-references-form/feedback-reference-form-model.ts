export default class FeedbackReferenceFormModel {
    constructor(
        public id: string,
        public references: string[]
    ) {}

    public static create(): FeedbackReferenceFormModel {
        return new FeedbackReferenceFormModel(
            "",
            []
        )
    }
}