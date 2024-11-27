import OpenAI from 'openai';
import LlmClient, {ClientRequest, ClientResponse} from "../llm-client";
import {Llm} from "../llm";
import dotenv from 'dotenv';

export default class O1Client implements LlmClient {

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

    private generateSystemMessage(request: ClientRequest): O1Message {
        return O1Message.of(
            O1Role.USER,
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

    private generateMessages(request: ClientRequest): O1Message[] {
        return request.promptGroup.prompts.slice(1).map(prompt =>
            O1Message.of(
                O1Role.USER,
                prompt
            )
        );
    }
}

class O1Message {
    private constructor(
        public readonly role: O1Role,
        public readonly content: string
    ) {}

    public static of(
        role: O1Role,
        content: string
    ): O1Message {
        return new O1Message(
            role,
            content
        )
    }
}

enum O1Role {
    ASSISTANT = "assistant",
    USER = "user"
}