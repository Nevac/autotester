import ChatGroupRepository from "./chat-group-repository";
import {Chat} from "../chat";
import {ChatGroup} from "./chat-group";

export default class ChatGroupService {

    private readonly repository: ChatGroupRepository

    constructor(
    ) {
        this.repository = new ChatGroupRepository();
    }

    public async getAll(): Promise<ChatGroup[]> {
        return await this.repository.getAll();
    }

    public async create(chatGroup: ChatGroup): Promise<ChatGroup> {
        return await this.repository.create(chatGroup);
    }
}