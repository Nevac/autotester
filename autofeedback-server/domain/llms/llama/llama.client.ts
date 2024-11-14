import OpenAI from 'openai';
import LlmClient, {ClientRequest, ClientResponse} from "../llm-client";
import {Llm} from "../llm";
import dotenv from 'dotenv';

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
        console.log(this.model.toString())
        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    this.generateSystemMessage(request),
                    ...this.generateMessages(request)
                ],
                model: this.model
            })

            console.log(completion);

            return ClientResponse.ofGPTChatCompletion(completion);
        } catch (error) {
            console.error("Error in completion:", error);
            throw error;
        }
    }

    private generateSystemMessage(request: ClientRequest): LlamaMessage {
        return LlamaMessage.of(
            LlamaRole.SYSTEM,
            `
            ${request.promptGroup.prompts[0]}
                
            Exercise:
            ${request.exercise.task}
            
            Example Solution:
            ${request.exercise.solution}
            
            Attempt:
            ${request.attempt}
            `
        );
    }

    private generateMessages(request: ClientRequest): LlamaMessage[] {
        return request.promptGroup.prompts.map(prompt =>
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