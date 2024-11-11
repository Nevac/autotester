import ChatRepository from "./chat-repository";
import {ChatListEntry} from "./chat-list-entry";
import ChatUpdateDto from "./chat-update-dto";
import {Chat} from "./chat";
import ChatUpdate from "./chat-update";
import LlmRepository from "../llms/llm-repository";
import ChatGroupRepository from "./group/chat-group-repository";

export default class ChatService {

    private readonly chatRepo: ChatRepository;
    private readonly chatGroupRepo: ChatGroupRepository;
    private readonly llmRepo: LlmRepository;

    constructor(
    ) {
        this.chatRepo = new ChatRepository();
        this.chatGroupRepo = new ChatGroupRepository();
        this.llmRepo = new LlmRepository();
    }

    public async getAllListEntriesByChatGroupId(chatGroupId: string): Promise<ChatListEntry[]> {
        return await this.chatRepo.getAllListEntriesByChatGroupId(chatGroupId);
    }

    public async create(chat: ChatUpdateDto): Promise<Chat> {
        const chatGroup = await this.chatGroupRepo.getById(chat.chatGroupId);
        const llm = await this.llmRepo.getById(chat.modelId);

        return await this.chatRepo.create(
            new ChatUpdate(
                chat.name,
                chat.chatGroupId,
                llm,
                chatGroup.exercise,
                chatGroup.promptGroup,
                chatGroup.attempt,
                []
            )
        );
    }

    public async delete(id: string): Promise<boolean> {
        return await this.chatGroupRepo.delete(id);
    }
}