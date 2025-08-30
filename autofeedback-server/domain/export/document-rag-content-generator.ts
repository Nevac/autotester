import FeedbackReference from "../attempts/expected-feedback/feedback-reference";
import md from "./markdown-it";
import RagDoc from "../rag/document/rag-doc";


export default class DocumentRagContentGenerator {

    public static generate(ragDocs: RagDoc[]): string {
        const categoryMap = new Map<string, RagDoc>(
            ragDocs.map(ragDoc => [ragDoc.metadata.category, ragDoc])
        )

        const categories = Array.from(
            categoryMap.keys()
        );
        categories.sort((a, b) => a.localeCompare(b));

        const ragDocsMap = new Map<string, RagDoc[]>();
        for (const ragDoc of ragDocs) {
            const category = ragDoc.metadata.category;
            if(ragDocsMap.has(category)) {
                ragDocsMap.get(category)!.push(ragDoc);
            } else {
                ragDocsMap.set(category, [ragDoc]);
            }
        }
        Array.from(ragDocsMap.values())
            .forEach(attempts =>
                attempts.sort((a, b) => a.externalId.localeCompare(b.externalId)
            ));

        let markdown = "";
        for(const categoryIndex in categories) {
            const category = categories[categoryIndex];
            const chapterNumber = parseFloat(categoryIndex) + 1;
            markdown += `# ${chapterNumber}. ${category} \n`

            const ragDocs = ragDocsMap.get(category)!;
            for(const ragDocIndex in ragDocs) {
                const ragDoc = ragDocs[ragDocIndex];
                const subChapterNumber = parseFloat(ragDocIndex) + 1;
                markdown += `## ${chapterNumber}.${subChapterNumber}. ${ragDoc.externalId} | ${this.extractTitle(ragDoc)} \n`;
                markdown += `${this.changeHeadings(ragDoc.metadata.text)} \n`;
            }
        }

        return md.render(markdown);
    }

    private static changeHeadings(task: string): string {
        return task
            .replace(/## /g, "### ")
            .replace(/# /g, "### ");
    }

    private static extractTitle(ragDoc: RagDoc) {
        const text = ragDoc.metadata.text;
        return text.slice(3, text.indexOf("\n"));
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