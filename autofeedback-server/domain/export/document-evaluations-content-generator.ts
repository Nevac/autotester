import {Attempt} from "../attempts/attempt";
import {Exercise} from "../exercises/exercise";
import FeedbackReference from "../attempts/expected-feedback/feedback-reference";
import md from "./markdown-it";
import {Evaluation} from "../evaluations/evaluation";
import {EvaluationGroup} from "../evaluations/group/evaluation-group";
import RagDoc from "../rag/document/rag-doc";
import EvaluationRagDocument from "../evaluations/rag-document/evaluation-rag-document";
import {EvaluationScore} from "../evaluations/score/evaluation-score";
import MetricScore from "../evaluations/score/metric/metric-score";
import MetricOvergenerationScore from "../evaluations/score/metric/metric-overgeneration-score";
import {Llm} from "../llms/llm";


export default class DocumentEvaluationsContentGenerator {

    public static generate(
        evaluationGroups: Map<string, EvaluationGroup>,
        evaluations: Map<string, Evaluation>
    ): string {
        let markdown = "";
        const preppedEvaluations = this.prepareEvaluations(evaluations, evaluationGroups);

        let headerNumber = 1;
        for(const attemptName of Array.from(preppedEvaluations.keys())) {
            markdown += `# ${headerNumber}. ${attemptName}\n`
            const evaluationMap = preppedEvaluations.get(attemptName)!;
            const llmList = Array.from(evaluationMap.keys()).sort((a, b) =>
                a.toString().localeCompare(b.toString())
            );
            for(const llmIndex in llmList) {
                const llm = llmList[llmIndex];
                const evaluations = evaluationMap.get(llm)!;
                const subheaderNumber = parseFloat(llmIndex) + 1;
                markdown += `## ${headerNumber}.${subheaderNumber}. ${llm}\n`
                for (const evaluationIndex in evaluations) {
                    const evaluation = evaluations[evaluationIndex]
                    const evaluationGroup = evaluationGroups.get(evaluation.evaluationGroup)!;
                    const subsubheaderNumber = parseFloat(evaluationIndex) + 1;
                    markdown += `### ${headerNumber}.${subheaderNumber}.${subsubheaderNumber} Evaluations Gruppe: ${evaluationGroup.name}\n`
                    markdown += `#### Generiertes Feedback\n`
                    markdown += `${this.changeHeadings(evaluation.generatedFeedback)}\n`
                    markdown += `${this.ragDocuments(evaluation.ragDocuments)}\n`
                    markdown += '#### Scores\n';
                    markdown += `${this.metricScores(evaluation.score)}\n`
                }
            }
            headerNumber++;
        }

        return md.render(markdown);
    }

    private static changeHeadings(task: string): string {
        return task
            .replace(/## /g, "### ")
            .replace(/# /g, "### ");
    }

    private static extractTitle(ragDoc: EvaluationRagDocument) {
        const text = ragDoc.text;
        return text.slice(3, text.indexOf("\n"));
    }

    private static ragDocuments(ragDocuments: EvaluationRagDocument[] | undefined): string {
        let markdown = `\n**RAG Dokumente**\n`

        if(ragDocuments === undefined) {
            markdown += 'RAG deaktiviert \n'
        } else if(ragDocuments.length <= 0) {
            markdown += 'Keine Dokumente \n'
        } else {
            for(const ragDocument of ragDocuments) {
                markdown += `- ${ragDocument.id} | ${this.extractTitle(ragDocument)}\n`
            }
        }
        return markdown;
    }

    private static prepareEvaluations(evaluations: Map<string, Evaluation>, evaluationGroups: Map<string, EvaluationGroup>): Map<string, Map<Llm, Evaluation[]>> {
        const evaluationMap = new Map<string, Map<Llm, Evaluation[]>>();
        Array.from(evaluations.values()).forEach(evaluation => {
            const attemptName = evaluation.attempt.name;
            const llm = evaluation.llm;

            if(evaluationMap.has(attemptName)) {
                const llmMap = evaluationMap.get(attemptName)!;
                if(llmMap.has(llm)) {
                    llmMap.get(llm)!.push(evaluation);
                } else {
                    llmMap.set(llm, [evaluation]);
                }
            } else {
                const llmMap = new Map<Llm, Evaluation[]>();
                llmMap.set(llm, [evaluation]);
                evaluationMap.set(attemptName, llmMap);
            }
        });

        Array.from(evaluationMap.values()).forEach(llmMap =>
            Array.from(llmMap.values()).forEach(evaluations =>
                evaluations.sort((a, b) =>
                    evaluationGroups.get(a.evaluationGroup)!.name.localeCompare(
                        evaluationGroups.get(b.evaluationGroup)!.name)
                )
            )
        );
        return evaluationMap;
    }

    private static metricScores(evaluationScore: EvaluationScore): string {
        let markdown = "##### Übersicht\n";
        markdown += `| Metrik | Punktzahl |
| ----------- | ----------- |\n`
        markdown += `| Korrektheit | ${evaluationScore.correctness.score} |\n`
        markdown += `| Vorschlag | ${evaluationScore.suggestion.score} |\n`
        markdown += `| Code Style | ${evaluationScore.codeStyle.score} |\n`
        markdown += `| Overgeneration | ${evaluationScore.overgeneration.score} |\n`
        markdown += `| **Total** | **${parseFloat(evaluationScore.total.toFixed(3))}** |\n`
        markdown += "\n";
        markdown += this.metricScoreDetail("Korrektheit", evaluationScore.correctness);
        markdown += this.metricScoreDetail("Vorschlag", evaluationScore.correctness);
        markdown += this.metricScoreDetail("Code Style", evaluationScore.correctness);
        markdown += this.metricOvergenerations("Overgenerations", evaluationScore.overgeneration);

        return markdown;
    }

    private static metricScoreDetail(metric: string, score: MetricScore) {
        let markdown = `##### ${metric}\n`;

        if(score.referenceAddressings.length > 0) {
            markdown += `| Referenz ID | Erfüllt | Semantische Ähnlichkeit | Erwartetes Feedback | Generiertes Feedback | Ignoriert |
| ----------- | ----------- | ----------- | ----------- | ----------- | ----------- |\n`
            for(const addressedReference of score.referenceAddressings) {
                markdown += `| ${addressedReference.id} | ${addressedReference.addressed} | ${addressedReference.similarityScore.toFixed(3)} | ${addressedReference.expectedSentence} | ${addressedReference.generatedSentence} | ${addressedReference.ignore} | \n`
            }
            markdown += "\n";
        } else {
            markdown += "Kein Feedback in dieser Metrik erwartet\n"
        }
        markdown += "\n";

        if(score.unreferencedFeedbacks.length > 0) {
            markdown += "_Unzuteilbares Feedback_\n"
            markdown += `| Index | Generiertes Feedback | Ignoriert |
| ----------- | ----------- | ----------- | \n`
            for(const unaddressedReference of score.unreferencedFeedbacks) {
                markdown += `| ${unaddressedReference.generatedFeedbackIndex} | ${unaddressedReference.generatedSentence} | ${unaddressedReference.ignore} |\n`
            }
        }

        return markdown;
    }

    private static metricOvergenerations(metric: string, score: MetricOvergenerationScore) {
        let markdown = `##### ${metric}\n`;

        if(score.overgenerations.length > 0) {
            markdown += `| Index | Generiertes Feedback | Validität |
| ----------- | ----------- | ----------- | \n`
            for(const overgeneration of score.overgenerations) {
                markdown += `| ${overgeneration.generatedFeedbackIndex} | ${overgeneration.sentence} | ${overgeneration.validity} |\n`
            }
            markdown += "\n";
        } else {
            markdown += "Keine Overgenerations\n"
        }
        markdown += "\n";
        return markdown;
    }
}