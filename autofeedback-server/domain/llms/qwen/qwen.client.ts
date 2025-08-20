import OpenAI from 'openai';
import LlmClient, {ClientRequest, ClientResponse} from "../llm-client";
import {Llm} from "../llm";
import dotenv from 'dotenv';
import PromptBuilder from "../prompt-builder";
import LlmConfig from "../llm-config";

export default class QwenClient implements LlmClient {

    private readonly client: OpenAI;

    public constructor(
        private readonly model: string
    ) {
        dotenv.config();
        this.client = new OpenAI({
            baseURL: "https://api-inference.huggingface.co/v1/",
            apiKey: process.env['API_KEY_QWEN'],
        });
    }

    public async create(request: ClientRequest): Promise<ClientResponse> {
        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    this.generateSystemMessage(request),
                ],
                model: this.model,
                max_tokens: LlmConfig.MAX_TOKEN,
                temperature: LlmConfig.TEMP,
                top_p: LlmConfig.TOP_P,
                frequency_penalty: LlmConfig.FREQ_PENALTY,
                presence_penalty: LlmConfig.PRES_PENALTY
            })


            return ClientResponse.ofQwenCompletion(completion);
        } catch (error) {
            console.error("Error in completion:", error);
            throw error;
        }
    }

    private generateSystemMessage(request: ClientRequest): QwenMessage {
        return QwenMessage.of(
            QwenRole.SYSTEM,
            PromptBuilder.default(request)
        );
    }

    private generateMessages(request: ClientRequest): QwenMessage[] {
        return request.promptGroup.prompts.slice(1).map(prompt =>
            QwenMessage.of(
                QwenRole.USER,
                prompt
            )
        );
    }
}

class QwenMessage {
    private constructor(
        public readonly role: QwenRole,
        public readonly content: string
    ) {}

    public static of(
        role: QwenRole,
        content: string
    ): QwenMessage {
        return new QwenMessage(
            role,
            content
        )
    }
}

enum QwenRole {
    SYSTEM = "system",
    ASSISTANT = "assistant",
    USER = "user"
}