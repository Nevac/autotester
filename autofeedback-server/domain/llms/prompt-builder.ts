import {ClientRequest} from "./llm-client";

export default class PromptBuilder {

    public static default(request: ClientRequest) {
        return `
Instruction:
${request.promptGroup.prompts.join('\n')}
    
--------
Exercise:
${request.exercise.task}

${request.exercise.solution !== " " ? '-------- \nExample Solution:' : ""} 
${request.exercise.solution}
            
--------
Attempt:
${request.attempt}

${this.doesHaveRag(request.ragDocuments) ? this.embedRagDocuments(request.ragDocuments!) : ""} 
        `
    }

    private static doesHaveRag(rag: string[] | undefined) {
        return rag && rag.length !== 0;
    }

    private static embedRagDocuments(documents: string[]) {
        return [
            '--------',
            'Additional RAG Documents:',
            ...documents
        ].join('\n');
    }
}