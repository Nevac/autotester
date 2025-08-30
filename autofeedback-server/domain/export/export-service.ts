import LlmService from "../llms/llm-service";
import SemanticEvaluatorClient from "../semantic-evaluators/semantic-evaluator-client";
import ModernBertClient from "../semantic-evaluators/modern-bert-client";
import puppeteer from "puppeteer";
import HtmlDocumentGenerator from "./html-document-generator/html-document-generator";
import ExerciseService from "../exercises/exercise-service";
import AttemptService from "../attempts/attempt-service";

export default class ExportService {

    private readonly attemptService: AttemptService;
    private readonly semanticEvaluatorClient: SemanticEvaluatorClient;

    constructor(
    ) {
        this.attemptService = new AttemptService();
        this.semanticEvaluatorClient = new ModernBertClient();
    }

    public async exportAttempts(ids: string[]): Promise<Uint8Array> {
        try {
            const attempts = await this.attemptService.getAllByIds(ids);



            const html = HtmlDocumentGenerator.fromMarkdown(Array.from(attempts.values()));

            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: "networkidle0" });

            return await page.pdf({
                format: "A4",
                displayHeaderFooter: true,
                footerTemplate: `
                    <div style="font-size:10px; text-align:center; width:100%;">
                      Page <span class="pageNumber"></span> of <span class="totalPages"></span>
                    </div>`,
                margin: { top: "40px", bottom: "40px" }
            });
        } catch (err) {
            console.error(err);
            throw new Error("Error while generating PDF");
        }
    }
}