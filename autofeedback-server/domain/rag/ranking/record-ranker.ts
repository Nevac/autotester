import CONSTRUCT_WEIGHTS from "../../ast/construct-weights";
import {ScoredPineconeRecord} from "@pinecone-database/pinecone";
import RagResponseMetadata from "../rag-response-metadata";

export default class RecordRanker {
    public static rerankByConstructOverlap(
        docs: ScoredPineconeRecord<RagResponseMetadata>[],
        queryConstructs: string[],
        alpha: number = 1.0,
        baseBeta: number = 0.3
    ): ScoredPineconeRecord<RagResponseMetadata>[] {
        return new RecordRanker().rerankByConstructOverlap(
            docs,
            queryConstructs,
            alpha,
            baseBeta
        );
    }

    public rerankByConstructOverlap(
        docs: ScoredPineconeRecord<RagResponseMetadata>[],
        queryConstructs: string[],
        alpha: number = 1.0,
        baseBeta: number = 0.3
    ): ScoredPineconeRecord<RagResponseMetadata>[] {
        const similarities = docs.map(d => d.score ?? 0).sort((a, b) => b - a);
        const beta = this.adaptiveBeta(similarities, baseBeta);

        return docs
            .map(doc => {
                const similarity = doc.score ?? 0;
                const docConstructs = doc.metadata?.constructs ?? [];
                const constructScore = this.computeWeightedConstructScore(queryConstructs, docConstructs);

                const finalScore = alpha * similarity + beta * constructScore;
                return { ...doc, finalScore };
            })
            .sort((a, b) => b.finalScore - a.finalScore);
    }

    private adaptiveBeta(similarities: number[], baseBeta: number = 0.3): number {
        if (similarities.length === 0) return baseBeta;

        const top1 = similarities[0] ?? 0;
        const top3 = similarities[2] ?? top1;
        const gap = top1 - top3;

        let beta = baseBeta;

        // Adjust based on absolute confidence
        if (top1 > 0.9) beta *= 0.5;   // very confident → reduce construct influence
        if (top1 < 0.7) beta *= 2.0;   // weak match → boost constructs

        // Adjust based on closeness of top results
        if (gap < 0.05) beta *= 1.5;   // if results are clustered → let constructs break ties
        if (gap > 0.2) beta *= 0.7;    // if top doc is way ahead → trust embeddings more

        return beta;
    }

    private computeWeightedConstructScore(
        queryConstructs: string[],
        docConstructs: string[]
    ): number {
        if (!docConstructs) return 0;

        const querySet = new Set(queryConstructs);
        let score = 0;
        let maxPossible = 0;

        for (const qc of querySet) {
            const weight = CONSTRUCT_WEIGHTS[qc] ?? 1;
            maxPossible += weight;

            if (docConstructs.includes(qc)) {
                score += weight;
            }
        }

        return maxPossible > 0 ? score / maxPossible : 0;
    }
}