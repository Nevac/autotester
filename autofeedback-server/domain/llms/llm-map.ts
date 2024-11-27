import {Llm} from "./llm";
import ChatGptClient from "./chat-gpt/chat-gpt.client";
import LlmClient from "./llm-client";
import ClaudeClient from "./claude/claude.client";
import LlamaClient from "./llama/llama.client";
import GeminiClient from "./gemini/gemini.client";
import QwenClient from "./qwen/qwen.client";
import O1Client from "./o1/o1.client";

export const llmMap = new Map<string, LlmClient>([
    [Llm.GPT_3_5_turbo, new ChatGptClient("gpt-3.5-turbo-0125")],
    [Llm.GPT_4, new ChatGptClient("gpt-4-0613")],
    [Llm.GPT_4_turbo, new ChatGptClient("gpt-4-turbo-2024-04-09")],
    [Llm.GPT_4o, new ChatGptClient("gpt-4o-2024-08-06")],
    [Llm.GPT_4o_mini, new ChatGptClient("gpt-4o-mini-2024-07-18")],
    [Llm.GPT_4o_mini, new ChatGptClient("gpt-4o-mini-2024-07-18")],
    [Llm.O1_PREVIEW, new O1Client("o1-preview-2024-09-12")],
    [Llm.O1_MINI, new O1Client("o1-mini-2024-09-12")],
    [Llm.CLAUDE_3_HAIKU, new ClaudeClient("claude-3-haiku-20240307")],
    [Llm.CLAUDE_3_SONNET, new ClaudeClient("claude-3-sonnet-20240229")],
    [Llm.CLAUDE_3_OPUS, new ClaudeClient("claude-3-opus-20240229")],
    [Llm.CLAUDE_3_5_HAIKU, new ClaudeClient("claude-3-5-haiku-20241022")],
    [Llm.CLAUDE_3_5_SONNET, new ClaudeClient("claude-3-5-sonnet-20241022")],
    [Llm.CLAUDE_3_OPUS, new ClaudeClient("claude-3-opus-20240229")],
    [Llm.CLAUDE_3_5_HAIKU, new ClaudeClient("claude-3-5-haiku-20241022")],
    [Llm.CLAUDE_3_5_SONNET, new ClaudeClient("claude-3-5-sonnet-20241022")],
    [Llm.LLAMA_3, new LlamaClient("llama3-70b")],
    [Llm.LLAMA_3_1, new LlamaClient("llama3.1-405b")],
    [Llm.LLAMA_3_2, new LlamaClient("llama3.2-3b")],
    [Llm.GEMINI_1_5_FLASH, new GeminiClient("gemini-1.5-flash-002")],
    [Llm.GEMINI_1_5_FLASH_8B, new GeminiClient("gemini-1.5-flash-8b-001")],
    [Llm.GEMINI_1_5_PRO, new GeminiClient("gemini-1.5-pro-002")],
    [Llm.QWEN_2_5_CODER_32B_INSTRUCT , new QwenClient("Qwen/Qwen2.5-Coder-32B-Instruct")],
    [Llm.QWEN_2_5_72B_INSTRUCT, new QwenClient("Qwen/Qwen2.5-72B-Instruct")],
]);