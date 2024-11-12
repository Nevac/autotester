import {Llm} from "./llm";
import ChatGptClient from "./chat-gpt/chat-gpt.client";
import LlmClient from "./llm-client";

export const llmMap = new Map<string, LlmClient>([
    [Llm.GPT_3_5_turbo, new ChatGptClient(Llm.GPT_3_5_turbo)],
    [Llm.GPT_4, new ChatGptClient(Llm.GPT_4)],
    [Llm.GPT_4_turbo, new ChatGptClient(Llm.GPT_4_turbo)],
    [Llm.GPT_4o, new ChatGptClient(Llm.GPT_4o)]
]);