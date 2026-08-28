import {Attempt} from "../attempts/attempt";
import {Exercise} from "../exercises/exercise";
import FeedbackReference from "../attempts/expected-feedback/feedback-reference";
import md from "./markdown-it";


export default class DocumentAttemptsContentGenerator {

    public static generate(attempts: Attempt[]): string {
        const exMap = new Map<string, Exercise>(
            attempts.map(attempt => [attempt.exercise._id.toString(), attempt.exercise])
        )

        const exercises = Array.from(
            exMap.values()
        );
        exercises.sort((a, b) => a.name.localeCompare(b.name));

        const attemptsMap = new Map<string, Attempt[]>();
        for (const attempt of attempts) {
            const exerciseId = attempt.exercise._id.toString();
            if(attemptsMap.has(exerciseId)) {
                attemptsMap.get(exerciseId)!.push(attempt);
            } else {
                attemptsMap.set(exerciseId, [attempt]);
            }
        }
        Array.from(attemptsMap.values())
            .forEach(attempts =>
                attempts.sort((a, b) => a.name.localeCompare(b.name)
            ));

        let markdown = "";
        for(const exerciseIndex in exercises) {
            const exercise = exercises[exerciseIndex];
            const chapterNumber = parseFloat(exerciseIndex) + 1;
            markdown += `# ${chapterNumber}. ${exercise.name} \n`
            markdown += `**Schwierigkeit**: ${exercise.difficulty}\n`
            markdown += `${this.changeTaskHeaders(exercise.task)} \n`;
            markdown += `### Musterlösung \n`;
            markdown += `${exercise.solution} \n`

            const attempts = attemptsMap.get(exercise._id.toString())!;
            for(const attemptIndex in attempts) {
                const attempt = attempts[attemptIndex];
                const subChapterNumber = parseFloat(attemptIndex) + 1;
                markdown += `## ${chapterNumber}.${subChapterNumber}. ${attempt.name} \n`;
                markdown += `**Komplexität**: ${attempt.complexity}\n`
                markdown += `${attempt.attempt} \n`;
                markdown += `### Erwartetes Feedback \n`;
                markdown += this.expectedFeedbackGenerator('Korrektheit', attempt.expectedFeedback.correctness);
                markdown += "\n";
                markdown += this.expectedFeedbackGenerator('Anregung', attempt.expectedFeedback.suggestion);
                markdown += "\n";
                markdown += this.expectedFeedbackGenerator('Code Style', attempt.expectedFeedback.codeStyle);
                markdown += "\n";
            }
        }

        return md.render(markdown);
    }

    private static changeTaskHeaders(task: string): string {
        return task
            .replace(/## /g, "### ")
            .replace(/# /g, "### ")
            .replace(/==== /g, "####")
            .replace(/=== /g, "###");
    }

    private static expectedFeedbackGenerator(metric: string, feedbackReferences: FeedbackReference[]): string {
        let markdown = `**${metric}**\n`
        if(feedbackReferences.length > 0) {
            markdown += `| Id | Referenz Beschreibungen |
| ----------- | ----------- |\n`
            for (const feedbackReference of feedbackReferences) {
                markdown += feedbackReference.references.map((text, i) =>
                    `| ${i === 0 ? feedbackReference.id : "^^"} | ${text} |`
                ).join("\n");
                markdown += '\n';
            }
        } else {
            markdown += 'Keine Referenzen \n'
        }
        return markdown;
    }
}