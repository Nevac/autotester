import MetricBestHit from "./metric-best-hit";

export default class ScoreAddressing  {
    constructor(
        public readonly id: string,
        public addressed: boolean,
        public bestHit?: MetricBestHit
    ) {}

    public static create(id: string): ScoreAddressing {
        return new ScoreAddressing(
            id,
            false
        )
    }

    public setAddressed(value: boolean): ScoreAddressing {
        this.addressed = value;
        return this;
    }

    public setBestHit(value: MetricBestHit): ScoreAddressing {
        this.bestHit = value;
        return this;
    }
}