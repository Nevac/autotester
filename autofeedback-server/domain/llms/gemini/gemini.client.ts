import LlmClient, {ClientRequest, ClientResponse} from "../llm-client";
import dotenv from 'dotenv';
import {GoogleGenAI} from "@google/genai";
import PromptBuilder from "../prompt-builder";
import LlmConfig from "../llm-config";

export default class GeminiClient implements LlmClient {

    private readonly client: GoogleGenAI;

    public constructor(
        private readonly model: string
    ) {
        dotenv.config();
        this.client = new GoogleGenAI({apiKey: `${process.env['API_KEY_GEMINI']}`});
    }

    public async create(request: ClientRequest): Promise<ClientResponse> {
        try {
            const response = await this.client.models.generateContent({
                model: this.model,
                contents: this.generateSystemMessage(request),
                config: {
                    maxOutputTokens: LlmConfig.MAX_TOKEN,
                    topP: LlmConfig.TOP_P,
                    temperature: LlmConfig.TEMP,
                    frequencyPenalty: LlmConfig.FREQ_PENALTY,
                    presencePenalty: LlmConfig.PRES_PENALTY
                }
            });
            return ClientResponse.ofGeminiContentResult(response);
        } catch (error) {
            console.error("Error in completion:", error);
            throw error;
        }
    }

    private generateSystemMessage(request: ClientRequest): string {
        return PromptBuilder.default(request);
    }

    private generateMessages(request: ClientRequest): string[] {
        return request.promptGroup.prompts.slice(1);
    }
}

class GeminiMessage {
    public readonly parts: { text:string }[];

    private constructor(
        public readonly role: GeminiRole,
        content: string
    ) {
        this.parts = [{ text: content}]
    }

    public static of(
        role: GeminiRole,
        content: string
    ): GeminiMessage {
        return new GeminiMessage(
            role,
            content
        )
    }

    public toString() {
        return
    }
}

enum GeminiRole {
    USER = "user",
    MODEL = "model"
}