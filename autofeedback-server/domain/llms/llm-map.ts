import {Llm} from "./llm";
import ChatGptClient from "./chat-gpt/chat-gpt.client";
import LlmClient from "./llm-client";
import ClaudeClient from "./claude/claude.client";
import LlamaClient from "./llama/llama.client";
import GeminiClient from "./gemini/gemini.client";
import QwenClient from "./qwen/qwen.client";
import O1Client from "./o1/o1.client";
import MistralClient from "./mistral/mistral.client";

export const llmMap = new Map<string, LlmClient>([
    [Llm.GPT_4_turbo, new ChatGptClient("gpt-4-turbo-2024-04-09")],
    [Llm.GPT_4o_06, new ChatGptClient("gpt-4o-2024-08-06")],
    [Llm.GPT_4o_13, new ChatGptClient("gpt-4o-2024-08-06")],
    [Llm.O1_PREVIEW, new O1Client("o1-preview-2024-09-12")],
    [Llm.O1_MINI, new O1Client("o1-mini-2024-09-12")],
    [Llm.CLAUDE_3_5_SONNET_22, new ClaudeClient("claude-3-5-sonnet-20241022")],
    [Llm.CLAUDE_3_5_SONNET_20, new ClaudeClient("claude-3-5-sonnet-20240620")],
    [Llm.LLAMA_3_1, new LlamaClient("llama3.1-405b")],
    [Llm.GEMINI_1_5_PRO, new GeminiClient("gemini-1.5-pro-002")],
    [Llm.QWEN_2_5_CODER_32B_INSTRUCT , new QwenClient("Qwen/Qwen2.5-Coder-32B-Instruct")],
    [Llm.MISTRAL_LARGE, new MistralClient("mistral-large-latest")],
]);