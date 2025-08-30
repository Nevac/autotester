import AttemptRepository from "./attempt-repository";
import AttemptUpdateDto from "./attempt-update-dto";
import AttemptListEntry from "./attempt-list-entry";
import {Attempt} from "./attempt";
import ExerciseRepository from "../exercises/exercise-repository";
import AttemptUpdate from "./attempt-update";
import ExportDocumentContentGenerator from "../export/document-content-generator";
import ExportDocumentGenerator from "../export/document-generator";

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
        const htmlContent = ExportDocumentContentGenerator.attempts(Array.from(attempts.values()));
        return await ExportDocumentGenerator.pdf("Anhang Aufgaben", htmlContent);
    }
}