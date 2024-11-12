import LlmClient from "./llm-client";
import {Llm} from "./llm";
import {llmMap} from "./llm-map";

export default class LlmService {
    public resolveLlmService(llm: Llm): LlmClient {
        if(llmMap.has(llm)) {
            return llmMap.get(llm)!;
        }
        throw new Error(`No Client specified for LLM ${llm}`)
    }
}