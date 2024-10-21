import ChatGroupRepository from "./chat-group-repository";
import {ChatGroup, IChatGroup} from "./chat-group";
import ChatGroupUpdateDto from "./chat-group-update-dto";
import ExerciseRepository from "../../exercises/exercise-repository";
import ExerciseListEntry from "../../exercises/exercise-list-entry";
import ChatGroupListEntry from "./chat-group-list-entry";
import {Exercise} from "../../exercises/exercise";
import PromptGroup from "../../prompts/promptGroup";
import PromptGroupRepository from "../../prompts/prompt-group-repository";
import ChatGroupUpdate from "./chat-group-update";

export default class ChatGroupService {

    private readonly chatGroupRepo: ChatGroupRepository;

    private readonly exerciseRepo: ExerciseRepository;
    private readonly promptGroupRepo: PromptGroupRepository;

    constructor(
    ) {
        this.chatGroupRepo = new ChatGroupRepository();
        this.exerciseRepo = new ExerciseRepository();
        this.promptGroupRepo = new PromptGroupRepository();
    }

    public async getAll(): Promise<ChatGroup[]> {
        return await this.chatGroupRepo.getAll();
    }

    public async getAllListEntries(): Promise<ChatGroupListEntry[]> {
        return await this.chatGroupRepo.getAllListEntries();
    }

    public async create(chatGroup: ChatGroupUpdateDto): Promise<ChatGroup> {
        return await this.chatGroupRepo.create(
            new ChatGroupUpdate(
                chatGroup.name,
                await this.exerciseRepo.getById(chatGroup.exerciseId),
                chatGroup.attempt,
                await this.promptGroupRepo.getById(chatGroup.promptGroupId)
            )
        );
    }

    public async delete(id: string): Promise<boolean> {
        return await this.chatGroupRepo.delete(id);
    }
}