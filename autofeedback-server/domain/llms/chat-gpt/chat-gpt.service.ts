import OpenAI from 'openai';
import LLMClient from "../llm-client";
import * as process from "node:process";
import Chat from "../../chats/chat";

export default class ChatGptService implements LLMClient {

    constructor(
        public readonly client: OpenAI
    ) {
        this.client = new OpenAI({
            apiKey: process.env['API_KEY_CHAT_GPT'], // This is the default and can be omitted
        });
    }

    create(chat: Chat) {

    }
}