import { Mistral } from '@mistralai/mistralai';
import LlmClient, {ClientRequest, ClientResponse} from "../llm-client";
import dotenv from 'dotenv';
import PromptBuilder from "../prompt-builder";
import LlmConfig from "../llm-config";

export default class MistralClient implements LlmClient {

    private readonly client: Mistral;

    public constructor(
        private readonly model: string
    ) {
        dotenv.config();
        this.client = new Mistral({
            apiKey: process.env['API_KEY_MISTRAL'],
        });
    }

    public async create(request: ClientRequest): Promise<ClientResponse> {
        console.log(this.model.toString())
        try {
            const completion = await this.client.chat.complete({
                messages: [
                    this.generateSystemMessage(request),
                ],
                model: this.model,
                maxTokens: LlmConfig.MAX_TOKEN,
                temperature: LlmConfig.TEMP,
                topP: LlmConfig.TOP_P,
                frequencyPenalty: LlmConfig.FREQ_PENALTY,
                presencePenalty: LlmConfig.PRES_PENALTY
            })
            return ClientResponse.ofMinstralCompletion(completion);
        } catch (error) {
            console.error("Error in completion:", error);
            throw error;
        }
    }

    private generateSystemMessage(request: ClientRequest): MinstralMessage {
        return MinstralMessage.of(
            MinstralRole.SYSTEM,
            PromptBuilder.default(request)
        );
    }

    private generateMessages(request: ClientRequest): MinstralMessage[] {
        return request.promptGroup.prompts.slice(1).map(prompt =>
            MinstralMessage.of(
                MinstralRole.USER,
                prompt
            )
        );
    }
}

class MinstralMessage {
    private constructor(
        public readonly role: MinstralRole,
        public readonly content: string
    ) {}

    public static of(
        role: MinstralRole,
        content: string
    ): MinstralMessage {
        return new MinstralMessage(
            role,
            content
        )
    }
}

enum MinstralRole {
    SYSTEM = "system",
    ASSISTANT = "assistant",
    USER = "user"
}