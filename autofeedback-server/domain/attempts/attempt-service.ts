import AttemptRepository from "./attempt-repository";
import AttemptUpdateDto from "./attempt-update-dto";
import AttemptListEntry from "./attempt-list-entry";
import {Attempt} from "./attempt";
import ExerciseRepository from "../exercises/exercise-repository";
import AttemptUpdate from "./attempt-update";
import HtmlDocumentGenerator from "../export/html-document-generator/html-document-generator";
import puppeteer from "puppeteer";

export default class AttemptService {

    private readonly attemptRepository: AttemptRepository;

    private readonly exerciseRepo: ExerciseRepository;

    constructor(
    ) {
        this.attemptRepository = new AttemptRepository();
        this.exerciseRepo = new ExerciseRepository();
    }

    public async getAll(): Promise<Attempt[]> {
        return await this.attemptRepository.getAll();
    }

    public async getAllByIds(ids: string[]): Promise<Map<string, Attempt>> {
        return await this.attemptRepository.findAllByIds(ids);
    }


    public async getAllListEntries(): Promise<AttemptListEntry[]> {
        return await this.attemptRepository.getAllListEntries();
    }

    public async getById(id: string): Promise<Attempt> {
        return await this.attemptRepository.getById(id);
    }

    public async create(attempt: AttemptUpdateDto): Promise<Attempt> {
        return await this.attemptRepository.create(
            new AttemptUpdate(
                attempt.name,
                await this.exerciseRepo.getById(attempt.exerciseId),
                attempt.complexity,
                attempt.attempt,
                attempt.expectedFeedback
            )
        );
    }

    public async update(id: string, update: AttemptUpdateDto): Promise<Attempt> {
        return await this.attemptRepository.update(
            id,
            new AttemptUpdate(
                update.name,
                await this.exerciseRepo.getById(update.exerciseId),
                update.complexity,
                update.attempt,
                update.expectedFeedback
            )
        );
    }

    public async delete(id: string): Promise<boolean> {
        return await this.attemptRepository.delete(id);
    }

    public async export(ids: string[]): Promise<Buffer> {
            const attempts = await this.attemptRepository.findAllByIds(ids);
            const html = HtmlDocumentGenerator.fromMarkdown(Array.from(attempts.values()));

            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: "networkidle0" });

            const pdf = await page.pdf({
                format: "A4",
                displayHeaderFooter: true,
                headerTemplate: "",
                footerTemplate: `
            <div style="font-size:10px; text-align:center; width:100%;">
              Page <span class="pageNumber"></span> of <span class="totalPages"></span>
            </div>`,
                margin: { top: "40px", bottom: "40px" }
            })
            await browser.close();

            return pdf as Buffer; // 👈 cast it here
    }
}