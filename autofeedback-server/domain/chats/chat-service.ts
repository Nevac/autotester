import ChatRepository from "./chat-repository";
import {ChatListEntry} from "./chat-list-entry";
import ChatUpdateDto from "./chat-update-dto";
import {Chat} from "./chat";
import ChatUpdate from "./chat-update";
import LlmRepository from "../llms/llm-repository";
import ChatGroupRepository from "./group/chat-group-repository";
import LlmService from "../llms/llm-service";
import {ClientRequest} from "../llms/llm-client";

export default class ChatService {

    private readonly chatRepo: ChatRepository;
    private readonly chatGroupRepo: ChatGroupRepository;
    private readonly llmService: LlmService;

    constructor(
    ) {
        this.chatRepo = new ChatRepository();
        this.chatGroupRepo = new ChatGroupRepository();
        this.llmService = new LlmService();
    }

    public async getAllListEntriesByChatGroupId(chatGroupId: string): Promise<ChatListEntry[]> {
        return await this.chatRepo.getAllListEntriesByChatGroupId(chatGroupId);
    }

    public async create(chat: ChatUpdateDto): Promise<Chat> {
        const chatGroup = await this.chatGroupRepo.getById(chat.chatGroupId);

        const client = this.llmService.resolveLlmService(chat.llm);
        const response = await client.create(
            new ClientRequest(chatGroup.promptGroup, chatGroup.exercise)
        );

        return await this.chatRepo.create(
            new ChatUpdate(
                chat.name,
                chat.chatGroupId,
                chat.llm,
                chatGroup.exercise,
                chatGroup.promptGroup,
                chatGroup.attempt,
                response.messages
            )
        );
    }

    public async delete(id: string): Promise<boolean> {
        return await this.chatGroupRepo.delete(id);
    }
}