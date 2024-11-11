import OpenAI from 'openai';
import LLMClient from "../llm-client";
import {Chat} from "../../chats/chat";
import {ChatCompletion} from "openai/resources";


export default class ChatGptService implements LLMClient {

    public constructor(
        public readonly client: OpenAI
    ) {
        this.client = new OpenAI({
            apiKey: process.env['API_KEY_CHAT_GPT'],
        });
    }

    public async create(chat: Chat) {
        const completion = await this.client.chat.completions.create({
            messages: [
                this.generateSystemMessage(chat),
                ...this.generateMessages(chat)
            ],
            model: "gpt-4o"
        })

        console.log(completion);
    }

    private generateSystemMessage(chat: Chat): ChatGPTMessage {
        return ChatGPTMessage.of(
            ChatGPTRole.SYSTEM,
            `
            ${chat.promptGroup.prompts[0]}
                
            Exercise:
            ${chat.exercise.task}
            
            Example Solution:
            ${chat.exercise.solution}
            `
        );
    }

    private generateMessages(chat: Chat): ChatGPTMessage[] {
        return chat.promptGroup.prompts.map(prompt =>
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