import OpenAI from 'openai';
import LlmClient, {ClientRequest, ClientResponse} from "../llm-client";
import {Llm} from "../llm";
import dotenv from 'dotenv';
import {GoogleGenerativeAI} from "@google/generative-ai";

export default class GeminiClient implements LlmClient {

    private readonly client: GoogleGenerativeAI;

    public constructor(
        private readonly model: string
    ) {
        dotenv.config();
        this.client = new GoogleGenerativeAI(`${process.env['API_KEY_GEMINI']}`);
    }

    public async create(request: ClientRequest): Promise<ClientResponse> {
        try {
            const model = this.client.getGenerativeModel({model: this.model})
            const contentResult = await model.startChat().sendMessage([
                this.generateSystemMessage(request),
                ...this.generateMessages(request)
            ]);

            console.log(contentResult);

            return ClientResponse.ofGeminiContentResult(contentResult);
        } catch (error) {
            console.error("Error in completion:", error);
            throw error;
        }
    }

    private generateSystemMessage(request: ClientRequest): string {
        return `
            ${request.promptGroup.prompts[0]}
                
            Exercise:
            ${request.exercise.task}
            
            Example Solution:
            ${request.exercise.solution}
            
            Attempt:
            ${request.attempt}
            `
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