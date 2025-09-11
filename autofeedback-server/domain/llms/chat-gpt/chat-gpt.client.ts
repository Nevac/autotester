import OpenAI from 'openai';
import LlmClient, {ClientRequest, ClientResponse} from "../llm-client";
import dotenv from 'dotenv';
import PromptBuilder from "../prompt-builder";
import LlmConfig from "../llm-config";

export default class ChatGptClient implements LlmClient {

    private readonly client: OpenAI;

    public constructor(
        private readonly model: string
    ) {
        dotenv.config();
        this.client = new OpenAI({
            apiKey: process.env['API_KEY_CHAT_GPT'],
        });
    }

    public async create(request: ClientRequest): Promise<ClientResponse> {
        try {
            console.log(PromptBuilder.default(request));
            const completion = await this.client.chat.completions.create({
                messages: [
                    this.generateSystemMessage(request)
                ],
                model: this.model,
                max_completion_tokens: LlmConfig.MAX_TOKEN,
                top_p: LlmConfig.TOP_P,
                frequency_penalty: LlmConfig.FREQ_PENALTY,
                presence_penalty: LlmConfig.PRES_PENALTY
            })
            return ClientResponse.ofGPTChatCompletion(completion);
        } catch (error) {
            console.error("Error in completion:", error);
            throw error;
        }
    }

    private generateSystemMessage(request: ClientRequest): ChatGPTMessage {
        return ChatGPTMessage.of(
            ChatGPTRole.USER,
            PromptBuilder.default(request)
        );
    }

    private generateMessages(request: ClientRequest): ChatGPTMessage[] {
        return request.promptGroup.prompts.slice(1).map(prompt =>
            ChatGPTMessage.of(
                ChatGPTRole.USER,
                prompt
            )
        );
    }
}

class ChatGPTMessage {
    private constructor(
        public readonly role: ChatGPTRole,
        public readonly content: string
    ) {}

    public static of(
        role: ChatGPTRole,
        content: string
    ): ChatGPTMessage {
        return new ChatGPTMessage(
            role,
            content
        )
    }
}

enum ChatGPTRole {
    SYSTEM = "system",
    ASSISTANT = "assistant",
    USER = "user"
}