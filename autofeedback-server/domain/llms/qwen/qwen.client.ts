import OpenAI from 'openai';
import LlmClient, {ClientRequest, ClientResponse} from "../llm-client";
import {Llm} from "../llm";
import dotenv from 'dotenv';

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
        console.log(this.model.toString())
        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    this.generateSystemMessage(request),
                    ...this.generateMessages(request)
                ],
                model: this.model
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