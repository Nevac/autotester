import OpenAI from 'openai';
import LlmClient, {ClientRequest, ClientResponse} from "../llm-client";
import dotenv from 'dotenv';
import PromptBuilder from "../prompt-builder";
import LlmConfig from "../llm-config";
import {Chat, ChatCompletion, ChatCompletionChunk, CompletionUsage} from "openai/resources";
import ChatCompletionMessageToolCall = Chat.ChatCompletionMessageToolCall;
type StreamWithId = AsyncIterable<ChatCompletionChunk> & { _request_id?: string | null };
type CollectOpts = { includeReasoning?: boolean; stripThinkTags?: boolean };

export default class DeepseekClient implements LlmClient {

    private readonly client: OpenAI;

    public constructor(
        private readonly model: string
    ) {
        dotenv.config();
        this.client = new OpenAI({
            baseURL: "https://router.huggingface.co/v1",
            apiKey: process.env['API_KEY_HUGGINGFACE'],
            timeout: 300_000
        });
    }

    public async create(request: ClientRequest): Promise<ClientResponse> {
        try {
            const stream = await this.client.chat.completions.create({
                messages: [
                    this.generateSystemMessage(request)
                ],
                model: this.model,
                max_completion_tokens: LlmConfig.MAX_TOKEN,
                top_p: LlmConfig.TOP_P,
                frequency_penalty: LlmConfig.FREQ_PENALTY,
                presence_penalty: LlmConfig.PRES_PENALTY,
                temperature: LlmConfig.TEMP,
                stream: true,
            })
            const { completion, requestId } = await this.collectChatStream(stream);
            return ClientResponse.ofGPTChatCompletion(completion);
        } catch (error) {
            console.error("Error in completion:", error);
            throw error;
        }
    }

    private generateSystemMessage(request: ClientRequest): DeepSeekMessage {
        return DeepSeekMessage.of(
            DeepSeekRole.USER,
            PromptBuilder.default(request)
        );
    }

    private async collectChatStream(
        stream: StreamWithId,
        opts: CollectOpts = { includeReasoning: false, stripThinkTags: true }
    ): Promise<{ completion: ChatCompletion; requestId?: string | null }> {
        let content = "";
        let usage: CompletionUsage | undefined;
        let finishReason: ChatCompletion["choices"][number]["finish_reason"] | null | undefined;
        let firstChunk: ChatCompletionChunk | undefined;

        // optional: capture reasoning (ignored by default)
        let reasoningBuf = "";

        const toolBuffers: Record<number, { id?: string; fnName: string; fnArgs: string }> = {};
        let sawToolCalls = false;

        for await (const chunk of stream) {
            if (!firstChunk) firstChunk = chunk;
            const choice = chunk.choices?.[0];
            const delta: any = choice?.delta ?? {};

            // --- Ignore provider-specific reasoning streams unless explicitly requested ---
            if (delta.reasoning_content) {
                if (opts.includeReasoning) reasoningBuf += delta.reasoning_content;
                continue; // don't mix into final content
            }
            if (delta.reasoning?.length) {
                if (opts.includeReasoning) reasoningBuf += delta.reasoning;
                continue;
            }

            // Regular assistant tokens
            if (delta.content) content += delta.content;

            // Tool calls (merge)
            if (delta.tool_calls) {
                sawToolCalls = true;
                for (const t of delta.tool_calls) {
                    const idx = t.index!;
                    toolBuffers[idx] ??= { fnName: "", fnArgs: "" };
                    if (t.id) toolBuffers[idx].id = (toolBuffers[idx].id ?? "") + t.id;
                    if (t.function?.name) toolBuffers[idx].fnName += t.function.name;
                    if (t.function?.arguments) toolBuffers[idx].fnArgs += t.function.arguments;
                }
            }

            if (choice?.finish_reason !== undefined) finishReason = choice.finish_reason;

            // usage appears on final chunk if requested with stream_options: { include_usage: true }
            const anyChunk = chunk as any;
            if (anyChunk?.usage) usage = anyChunk.usage as CompletionUsage;
        }

        // Remove <think>…</think> if the provider mixed it into content
        if (opts.stripThinkTags && content) content = this.stripThinkBlocks(content);

        const tool_calls: ChatCompletionMessageToolCall[] | undefined = sawToolCalls
            ? Object.values(toolBuffers).map((buf) => ({
                id: buf.id!,
                type: "function",
                function: { name: buf.fnName, arguments: buf.fnArgs },
            }))
            : undefined;

        const message: ChatCompletion["choices"][number]["message"] = {
            role: "assistant",
            content: content || (tool_calls ? null : ""),
            ...(tool_calls ? { tool_calls } : {}),
            refusal: null, // required by some SDK typings
            // if you actually want to surface the chain of thought in your logs/UI:
            // ...(opts.includeReasoning ? { reasoning: reasoningBuf } : {}),
        };

        const completion: ChatCompletion = {
            id: firstChunk?.id ?? `chatcmpl_${Date.now()}`,
            object: "chat.completion",
            created: firstChunk?.created ?? Math.floor(Date.now() / 1000),
            model: firstChunk?.model ?? "unknown",
            system_fingerprint: (firstChunk as any)?.system_fingerprint ?? null,
            choices: [{ index: 0, message, logprobs: null, finish_reason: finishReason ?? "stop" }],
            ...(usage ? { usage } : {}),
        };

        return { completion, requestId: (stream as any)._request_id ?? undefined };
    }

    /** Robustly removes any <think>...</think> blocks, including multiple occurrences. */
    private stripThinkBlocks(s: string): string {
        // remove any number of <think>…</think> blocks (non-greedy), repeatedly (handles nesting-ish)
        let prev: string;
        do {
            prev = s;
            s = s.replace(/<think>[\s\S]*?<\/think>\s*/gi, "");
        } while (s !== prev);
        return s.trim();
    }
}

class DeepSeekMessage {
    private constructor(
        public readonly role: DeepSeekRole,
        public readonly content: string
    ) {}

    public static of(
        role: DeepSeekRole,
        content: string
    ): DeepSeekMessage {
        return new DeepSeekMessage(
            role,
            content
        )
    }
}

enum DeepSeekRole {
    SYSTEM = "system",
    ASSISTANT = "assistant",
    USER = "user"
}