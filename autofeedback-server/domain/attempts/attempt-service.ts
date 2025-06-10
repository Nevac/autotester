import AttemptRepository from "./attempt-repository";
import AttemptUpdateDto from "./attempt-update-dto";
import AttemptListEntry from "./attempt-list-entry";
import {Attempt} from "./attempt";
import ChatGroupUpdate from "../chats/group/chat-group-update";
import ExerciseRepository from "../exercises/exercise-repository";
import AttemptUpdate from "./attempt-update";

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
                attempt.attempt
            )
        );
    }

    public async delete(id: string): Promise<boolean> {
        return await this.attemptRepository.delete(id);
    }
}