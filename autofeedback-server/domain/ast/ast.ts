import {Document, Schema} from "mongoose";
import {IEvaluation} from "../evaluations/evaluation";

interface IAst {
    enabled: boolean,
    constructs: string[]
}

export default class Ast implements IAst {
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

export const astSchema = new Schema<IAst>(
    {
        enabled: { type: Boolean, required: true },
        constructs: { type: [String], required: true },
    },
    {
        timestamps: true,
    }
);

export type AstDocument = Document<unknown, {}, IAst> & IAst & {};