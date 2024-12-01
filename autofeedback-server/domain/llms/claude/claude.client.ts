import Anthropic from '@anthropic-ai/sdk';
import LlmClient, {ClientRequest, ClientResponse} from "../llm-client";
import {Llm} from "../llm";
import dotenv from 'dotenv';

export default class ClaudeClient implements LlmClient {

    private readonly client: Anthropic;

    public constructor(
        private readonly model: string
    ) {
        dotenv.config();
        this.client = new Anthropic({
            apiKey: process.env['ANTHROPIC_API_KEY'], // This is the default and can be omitted
        });
    }

    public async create(request: ClientRequest): Promise<ClientResponse> {
        try {
            const message = await this.client.messages.create({
                max_tokens: 2048,
                messages: [
                    this.generateSystemMessage(request),
                    ...this.generateMessages(request)
                ],
                model: this.model
            });

            console.log(message);

            return ClientResponse.ofClaudeMessage(message);
        } catch (error) {
            console.error("Error in completion:", error);
            throw error;
        }
    }

    private generateSystemMessage(request: ClientRequest): ClaudeMessage {
        return ClaudeMessage.of(
            ClaudeRole.ASSISTANT,
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

    private generateMessages(request: ClientRequest): ClaudeMessage[] {
        return request.promptGroup.prompts.slice(1).map(prompt =>
            ClaudeMessage.of(
                ClaudeRole.USER,
                prompt
            )
        );
    }
}

class ClaudeMessage {
    private constructor(
        public readonly role: ClaudeRole,
        public readonly content: string
    ) {}

    public static of(
        role: ClaudeRole,
        content: string
    ): ClaudeMessage {
        return new ClaudeMessage(
            role,
            content
        )
    }
}

enum ClaudeRole {
    ASSISTANT = "assistant",
    USER = "user"
}