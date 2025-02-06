import {ClientRequest} from "./llm-client";

export default class PromptBuilder {

    public static default(request: ClientRequest) {
        return `
            
            ${request.promptGroup.prompts.join('\n')}
                
            Exercise:
            ${request.exercise.task}
            
            ${request.exercise.solution !== " " ? 'Example Solution:' : ""} 
            ${request.exercise.solution}
            
            Attempt:
            ${request.attempt}
        `
    }
}