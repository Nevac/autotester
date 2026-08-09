import RagStaticDocuments from "./rag-static-documents";

export default class RagStaticUpdate {
    constructor(
        public readonly name: string,
        public readonly exerciseRagDocuments: RagStaticDocuments[],
        public readonly attemptRagDocuments: RagStaticDocuments[],
    ) {}

    public static of(
        name: string,
        exerciseRagDocuments: Map<string, string[]>,
        attemptRagDocuments: Map<string, string[]>
    ) : RagStaticUpdate {
        return new RagStaticUpdate(
            name,
            Array.from(exerciseRagDocuments.entries()).map(([exerciseId, ragDocIds]) =>
                new RagStaticDocuments(
                    exerciseId,
                    ragDocIds
                )
            ),
            Array.from(attemptRagDocuments.entries()).map(([attemptId, ragDocIds]) =>
                new RagStaticDocuments(
                    attemptId,
                    ragDocIds
                )
            )
        )
    }
}