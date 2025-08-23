import OvergenerationValidity from "./overgeneration-validity";
import Overgeneration from "./overgeneration";

export default class OvergenerationUpsert {
    constructor(
        public generatedFeedbackIndex: number,
        public sentence: string,
        public validity: OvergenerationValidity
    ) {}

    public static ofOvergeneration(overgeneration: Overgeneration): OvergenerationUpsert {
        return new OvergenerationUpsert(
            overgeneration.generatedFeedbackIndex,
            overgeneration.sentence,
            overgeneration.validity
        );
    }

    public static ofOvergenerations(overgenerations: Overgeneration[]): OvergenerationUpsert[] {
        return overgenerations.map(overgeneration =>
            OvergenerationUpsert.ofOvergeneration(overgeneration)
        );
    }

    public setValidity(value: OvergenerationValidity): OvergenerationUpsert {
        this.validity = value;
        return this;
    }
}