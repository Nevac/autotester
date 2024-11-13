import PromptGroup from "../prompts/prompt-group";
import {Exercise} from "../exercises/exercise";
import {ChatCompletion} from "openai/resources";
import {ChatGroup} from "../chats/group/chat-group";

export default interface LlmClient {
    create(chat: ClientRequest): Promise<ClientResponse>
}

export class ClientRequest {
    constructor(
        public promptGroup: PromptGroup,
        public exercise: Exercise,
        public attempt: string
    ) {}

    public static ofChatGroup(chatGroup: ChatGroup): ClientRequest {
        return new ClientRequest(
            chatGroup.promptGroup,
            chatGroup.exercise,
            chatGroup.attempt
        )
    }
}

export class ClientResponse {
    constructor(
        public readonly messages: string[]
    ) {}

    public static ofGPTChatCompletion(completion: ChatCompletion): ClientResponse {
        return new ClientResponse(
            completion.choices.map(choice => choice.message.content!)
        )
    }
}