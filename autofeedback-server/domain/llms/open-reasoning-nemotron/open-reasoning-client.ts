import OpenAI from 'openai';
import LlmClient, {ClientRequest, ClientResponse} from "../llm-client";
import dotenv from 'dotenv';
import PromptBuilder from "../prompt-builder";
import LlmConfig from "../llm-config";

export default class OpenReasoningClient implements LlmClient {

    private readonly client: OpenAI;

    public constructor(
        private readonly model: string
    ) {
        dotenv.config();
        this.client = new OpenAI({
            baseURL: "https://router.huggingface.co/v1",
            apiKey: process.env['API_KEY_HUGGINGFACE'],
        });
    }

    public async create(request: ClientRequest): Promise<ClientResponse> {
        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    this.generateSystemMessage(request)
                ],
                model: this.model,
                max_completion_tokens: LlmConfig.MAX_TOKEN,
                top_p: LlmConfig.TOP_P,
                frequency_penalty: LlmConfig.FREQ_PENALTY,
                presence_penalty: LlmConfig.PRES_PENALTY,
                stream: false
            })
            return ClientResponse.ofGPTChatCompletion(completion);
        } catch (error) {
            console.error("Error in completion:", error);
            throw error;
        }
    }

    private generateSystemMessage(request: ClientRequest): NemotronMessage {
        return NemotronMessage.of(
            NemotronRole.USER,
            PromptBuilder.default(request)
        );
    }
}

class NemotronMessage {
    private constructor(
        public readonly role: NemotronRole,
        public readonly content: string
    ) {}

    public static of(
        role: NemotronRole,
        content: string
    ): NemotronMessage {
        return new NemotronMessage(
            role,
            content
        )
    }
}

enum NemotronRole {
    SYSTEM = "system",
    ASSISTANT = "assistant",
    USER = "user"
}