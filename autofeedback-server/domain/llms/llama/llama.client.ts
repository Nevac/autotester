import OpenAI from 'openai';
import LlmClient, {ClientRequest, ClientResponse} from "../llm-client";
import {Llm} from "../llm";
import dotenv from 'dotenv';
import PromptBuilder from "../prompt-builder";
import LlmConfig from "../llm-config";

export default class LlamaClient implements LlmClient {

    private readonly client: OpenAI;

    public constructor(
        private readonly model: string
    ) {
        dotenv.config();
        this.client = new OpenAI({
            apiKey: process.env['API_KEY_LLAMA'],
            baseURL: "https://api.llama-api.com"
        });
    }

    public async create(request: ClientRequest): Promise<ClientResponse> {
        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    this.generateSystemMessage(request)
                ],
                model: this.model,
                max_tokens: LlmConfig.MAX_TOKEN,
                temperature: LlmConfig.TEMP,
                top_p: LlmConfig.TOP_P,
                frequency_penalty: LlmConfig.FREQ_PENALTY,
                presence_penalty: LlmConfig.PRES_PENALTY
            })
            return ClientResponse.ofLlamaCompletion(completion);
        } catch (error) {
            console.error("Error in completion:", error);
            throw error;
        }
    }

    private generateSystemMessage(request: ClientRequest): LlamaMessage {
        return LlamaMessage.of(
            LlamaRole.SYSTEM,
            PromptBuilder.default(request)
        );
    }

    private generateMessages(request: ClientRequest): LlamaMessage[] {
        return request.promptGroup.prompts.slice(1).map(prompt =>
            LlamaMessage.of(
                LlamaRole.USER,
                prompt
            )
        );
    }
}

class LlamaMessage {
    private constructor(
        public readonly role: LlamaRole,
        public readonly content: string
    ) {}

    public static of(
        role: LlamaRole,
        content: string
    ): LlamaMessage {
        return new LlamaMessage(
            role,
            content
        )
    }
}

enum LlamaRole {
    SYSTEM = "system",
    ASSISTANT = "assistant",
    USER = "user"
}