import LlmRepository from "./llm-repository";
import {Llm} from "./llm";

export default class LlmService {

    private readonly repository: LlmRepository;

    constructor(
    ) {
        this.repository = new LlmRepository();
    }

    public async getAll(): Promise<Llm[]> {
        return await this.repository.getAll();
    }

    public async getById(id: string): Promise<Llm> {
        return await this.repository.getById(id);
    }
}