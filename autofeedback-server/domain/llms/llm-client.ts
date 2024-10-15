import Chat from "../chats/chat";

export default interface LLMClient {
    create(chat: Chat): void
}