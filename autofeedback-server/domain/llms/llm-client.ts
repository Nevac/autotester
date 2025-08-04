import PromptGroup from "../prompts/prompt-group";
import {Exercise} from "../exercises/exercise";
import {ChatCompletion} from "openai/resources";
import {ChatGroup} from "../chats/group/chat-group";
import Anthropic from "@anthropic-ai/sdk";
import {GenerateContentResult} from "@google/generative-ai";
import {ChatCompletionResponse} from "@mistralai/mistralai/models/components";
import {Evaluation} from "../evaluations/evaluation";

export default interface LlmClient {
    create(chat: ClientRequest): Promise<ClientResponse>
}

export class ClientRequest {
    constructor(
        public promptGroup: PromptGroup,
        public exercise: Exercise,
        public attempt: string,
        public ragDocuments?: string[]
    ) {}

    public static ofChatGroup(chatGroup: ChatGroup): ClientRequest {
        return new ClientRequest(
            chatGroup.promptGroup,
            chatGroup.exercise,
            chatGroup.attempt
        )
    }

    public static ofEvaluation(evaluation: Evaluation, ragDocuments: string[]) {
        return new ClientRequest(
            evaluation.promptGroup,
            evaluation.attempt.exercise,
            evaluation.attempt.attempt,
            ragDocuments
        );
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

    public static ofClaudeMessage(message: Anthropic.Message): ClientResponse {
        return new ClientResponse(
            message.content
                .filter(content => content.type === "text")
                .map(content => content.text)
        )
    }

    public static ofLlamaCompletion(completion: ChatCompletion): ClientResponse {
        return this.ofGPTChatCompletion(completion);
    }

    public static ofGeminiContentResult(contentResult: GenerateContentResult) {
        return new ClientResponse(
            [contentResult.response.text()]
        )
    }

    public static ofQwenCompletion(completion: ChatCompletion): ClientResponse {
        return this.ofGPTChatCompletion(completion);
    }

    public static ofMinstralCompletion(completion: ChatCompletionResponse): ClientResponse {
        return new ClientResponse(
            completion.choices!.map(choice => choice.message.content! as string)
        )
    }
}