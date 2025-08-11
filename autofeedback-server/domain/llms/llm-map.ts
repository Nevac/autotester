import {Llm} from "./llm";
import ChatGptClient from "./chat-gpt/chat-gpt.client";
import LlmClient from "./llm-client";
import ClaudeClient from "./claude/claude.client";
import GeminiClient from "./gemini/gemini.client";
import OxClient from "./o1/o1.client";
import DeepseekClient from "./deepseek/deepseek.client";

export const llmMap = new Map<string, LlmClient>([
    [Llm.GPT_4o, new ChatGptClient("gpt-4o-2024-08-06")],
    [Llm.GPT_5, new ChatGptClient("gpt-5-2025-08-07")],
    [Llm.O1_MINI, new OxClient("o1-mini-2024-09-12")],
    [Llm.O3, new OxClient("o3-2025-04-16")],
    [Llm.O4_MINI, new OxClient("o4-mini-2025-04-16")],
    [Llm.CLAUDE_4_SONNET, new ClaudeClient("claude-sonnet-4-20250514")],
    [Llm.CLAUDE_4_1_OPUS, new ClaudeClient("claude-opus-4-1-20250805")],
    [Llm.GEMINI_2_5_PRO, new GeminiClient("gemini-2.5-pro")],
    [Llm.DEEPSEEK_R1, new DeepseekClient("deepseek-ai/DeepSeek-R1:novita")],
    [Llm.DEEPSEEK_V3, new DeepseekClient("deepseek-ai/DeepSeek-V3:novita")],
]);