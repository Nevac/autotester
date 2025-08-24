import RagClient from "./rag-client";
import EmbeddingClient from "../embedding/embedding-client";
import {Index, Pinecone, ScoredPineconeRecord} from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import RagResponseMetadata from "../rag-response-metadata";
import EvaluationRagDocument from "../../evaluations/rag-document/evaluation-rag-document";
import RagDocumentUpsert from "../document/rag-document-upsert";
import AstExtractor from "../../ast/ast-extractor";
import RagResponse from "./rag-response";
import Ast from "../../ast/ast";
import CONSTRUCT_WEIGHTS from "../../ast/construct-weights";
import RecordRanker from "../ranking/record-ranker";

export default class PineconeClient implements RagClient {

    private readonly client: Pinecone;
    private readonly index: Index<RagResponseMetadata>;
    private readonly astExtractor: AstExtractor;

    private readonly DOCUMENT_COUNT = 3;
    private readonly NO_HARD_FILTER_DOCUMENT_COUNT = 20;

    constructor(
        private readonly embeddingClient: EmbeddingClient,
        namespace: string
    ) {
        dotenv.config();
        this.client = new Pinecone({
            apiKey: process.env['API_KEY_PINECONE']!
        })
        this.astExtractor = new AstExtractor();
        this.index = this.client.index<RagResponseMetadata>(process.env['PINECONE_INDEX']!).namespace("main");
    }

    public async retrieve(query: string, astEnabled: boolean): Promise<RagResponse> {
        let filter = undefined;
        let constructs: string[] = [];

        if (astEnabled) {
            constructs = this.astExtractor.extractConstructs(query);

            // Only hard filter on strong/rare constructs
            const hardFilterConstructs = constructs.filter(c =>
                ["god class", "duplication", "long method", "magic numbers", "exceptions"].includes(c)
            );

            if (hardFilterConstructs.length > 0 && hardFilterConstructs.length <= 5) {
                filter = { constructs: { $in: hardFilterConstructs } };
            }
        }

        const embedding = await this.embeddingClient.embed(query);
        const results = await this.index.query({
            vector: embedding[0].embedding,
            filter: filter,
            topK: filter ? this.DOCUMENT_COUNT : this.NO_HARD_FILTER_DOCUMENT_COUNT,
            includeMetadata: true
        });

        let docs = results.matches;

        if (!filter && astEnabled) {
            docs = RecordRanker.rerankByConstructOverlap(docs, constructs).slice(0, this.DOCUMENT_COUNT);
        } else {
            docs = docs.slice(0, this.DOCUMENT_COUNT);
        }

        return new RagResponse(
            EvaluationRagDocument.ofPineconeRecords(docs),
            new Ast(
                astEnabled,
                constructs
            )
        );
    }

    public async upsertAll(ragDocuments: RagDocumentUpsert[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async upsert(ragDocument: RagDocumentUpsert): Promise<void> {
        const embedding = await this.embeddingClient.embed(ragDocument.metadata.text);

        await this.index.upsert([
            {
                id: ragDocument.externalId,
                values: embedding[0].embedding,
                metadata: ragDocument.metadata
            }
        ])
    }

    public async delete(id: string): Promise<void> {
        await this.index.deleteOne(id);
    }
}