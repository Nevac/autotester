import OpenAI from 'openai';
import LlmClient, {ClientRequest, ClientResponse} from "../llm-client";
import {Chat} from "../../chats/chat";
import {ChatCompletion} from "openai/resources";
import {Llm} from "../llm";
import {model} from "mongoose";


export default class ChatGptClient implements LlmClient {

    private readonly client: OpenAI;

    public constructor(
        private readonly model: Llm
    ) {
        this.client = new OpenAI({
            apiKey: process.env['API_KEY_CHAT_GPT'],
        });
    }

    public async create(request: ClientRequest): Promise<ClientResponse> {
        const completion = await this.client.chat.completions.create({
            messages: [
                this.generateSystemMessage(request),
                ...this.generateMessages(request)
            ],
            model: this.model.toString()
        })

        console.log(completion);

        return ClientResponse.ofGPTChatCompletion(completion);
    }

    private generateSystemMessage(request: ClientRequest): ChatGPTMessage {
        return ChatGPTMessage.of(
            ChatGPTRole.SYSTEM,
            `
            ${request.promptGroup.prompts[0]}
                
            Exercise:
            ${request.exercise.task}
            
            Example Solution:
            ${request.exercise.solution}
            `
        );
    }

    private generateMessages(request: ClientRequest): ChatGPTMessage[] {
        return request.promptGroup.prompts.map(prompt =>
            ChatGPTMessage.of(
                ChatGPTRole.USER,
                prompt
            )
        );
    }
}

class ChatGPTMessage {
    private constructor(
        public readonly role: ChatGPTRole,
        public readonly content: string
    ) {}

    public static of(
        role: ChatGPTRole,
        content: string
    ): ChatGPTMessage {
        return new ChatGPTMessage(
            role,
            content
        )
    }
}

enum ChatGPTRole {
    SYSTEM = "system",
    ASSISTANT = "assistant",
    USER = "user"
}