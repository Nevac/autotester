import OvergenerationValidity from "./overgeneration-validity";

export default class Overgeneration {
    constructor(
        public readonly generatedFeedbackIndex: number,
        public readonly sentence: string,
        public readonly validity: OvergenerationValidity
    ) {}
}