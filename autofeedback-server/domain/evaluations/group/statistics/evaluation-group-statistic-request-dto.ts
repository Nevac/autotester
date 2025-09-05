export default class EvaluationGroupStatisticRequestDto {
    public constructor(
        readonly evaluationGroupBaseId: string,
        readonly evaluationGroupCompareIds: string[]
    ) {}
}