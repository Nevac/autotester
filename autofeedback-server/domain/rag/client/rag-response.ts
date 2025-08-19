import EvaluationRagDocument from "../../evaluations/rag-document/evaluation-rag-document";
import Ast from "../../ast/ast";

export default class RagResponse {
    constructor(
        public readonly documents: EvaluationRagDocument[],
        public readonly ast: Ast
    ) {}

    public static empty(ast: Ast): RagResponse {
        return new RagResponse(
            [],
            ast
        );
    }
}