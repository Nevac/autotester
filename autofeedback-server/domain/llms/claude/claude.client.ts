import Anthropic from '@anthropic-ai/sdk';
import LlmClient, {ClientRequest, ClientResponse} from "../llm-client";
import {Llm} from "../llm";
import dotenv from 'dotenv';
import PromptBuilder from "../prompt-builder";
import LlmConfig from "../llm-config";

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
                messages: [
                    this.generateSystemMessage(request)
                ],
                max_tokens: LlmConfig.MAX_TOKEN,
                model: this.model,
                temperature: LlmConfig.TEMP,
                top_p: LlmConfig.TOP_P
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
            ClaudeRole.USER,
            PromptBuilder.default(request)
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