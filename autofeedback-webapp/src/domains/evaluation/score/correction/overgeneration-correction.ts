import OvergenerationValidity from "../metric/overgeneration-validity";

export default class OvergenerationCorrection {
    constructor(
        public generatedFeedbackIndex: number,
        public validity: OvergenerationValidity
    ) {}

    public setValidity(value: OvergenerationValidity): OvergenerationCorrection {
        this.validity = value;
        return this;
    }
}