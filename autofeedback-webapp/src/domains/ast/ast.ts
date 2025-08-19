export default class Ast {
    constructor(
        public readonly enabled: boolean,
        public readonly constructs: string[]
    ) {}

    public static empty(enabled: boolean) {
        return new Ast(
            enabled,
            []
        );
    }
}