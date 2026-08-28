import FeedbackReference from "../attempts/expected-feedback/feedback-reference";
import md from "./markdown-it";
import RagDoc from "../rag/document/rag-doc";
import RagDocumentMetadata from "../rag/document/rag-document-metadata";


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
            const oCategory = ragDoc.metadata.category;
            const category = oCategory !== undefined ? oCategory : "uncategorized"
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
                markdown += "\n"
                markdown += `${this.metadataGenerator(ragDoc.metadata)} \n`;
                markdown += "\n";
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
        return text.slice(2, text.indexOf("\n"));
    }

    private static metadataGenerator(metadata: RagDocumentMetadata): string {
        let markdown = `### Metadata \n`;
        markdown += `| Metadata | Value |
| ----------- | ----------- |\n`
        markdown += this.metadataRow("category", metadata.category);
        markdown += this.metadataRow("language", metadata.language);
        markdown += this.metadataRow("topic", metadata.topic);
        markdown += this.metadataRow("type", metadata.type);
        markdown += this.metadataRow("constructs", metadata.constructs.join(", "));
        return markdown;
    }

    private static metadataRow(name: string, value?: string): string {
        return `| ${name} | ${value !== undefined || value !== "" ? value : "None"} |\n`;
    }
}