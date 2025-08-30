import MarkdownIt from "markdown-it";
import {Attempt} from "../../attempts/attempt";
import * as path from "node:path";
import * as fs from "node:fs";
import {Exercise} from "../../exercises/exercise";
import hljs from "highlight.js";



export default class HtmlDocumentGenerator {


    public static fromMarkdown(attempts: Attempt[]): string {

        const md = new MarkdownIt({html: true});

        //
        // md.set({
        //     highlight: (code, lang) => {
        //         if (lang && hljs.getLanguage(lang)) {
        //             return `<pre><code class="hljs language-${lang}">` +
        //                 hljs.highlight(code, { language: lang }).value +
        //                 `</code></pre>`;
        //         }
        //
        //         const numbered = code.split("\n")
        //             .map(line => `<div class="code-line">${line || "&nbsp;"}</div>`)
        //             .join("\n");
        //
        //         return `<div class="code-block hljs language-${lang}">${numbered}</div>`;
        //     }
        // });

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

        let markdown = "";
        for(const exerciseIndex in exercises) {
            const exercise = exercises[exerciseIndex];
            const chapterNumber = parseFloat(exerciseIndex) + 1;
            markdown += `# ${chapterNumber}. ${exercise.name} \n`
            markdown += `${this.changeTaskHeaders(exercise.task)} \n`;

            console.log(markdown);

            const attempts = attemptsMap.get(exercise._id.toString())!;
            for(const attemptIndex in attempts) {
                const attempt = attempts[attemptIndex];
                const subChapterNumber = parseFloat(attemptIndex) + 1;
                markdown += `## ${chapterNumber}.${subChapterNumber}. ${attempt.name} \n`
                markdown += `${attempt.attempt} \n`
            }
        }

        const content = md.render(markdown);

        const tocHandler = fs.readFileSync(
            path.join(process.cwd(), "public/paged-js/paged-toc.js"),
            "utf-8"
        );

        const tocScripts = `
          <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
          <script>${tocHandler}</script>
        `;

        return `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8"/>
              <title>Document</title>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
              <style>
                body { font-family: sans-serif; margin: 2rem; }
                h1, h2, h3 { page-break-after: avoid; }
                #toc { margin-bottom: 2rem; page-break-after: always; }
                .toc-entry { display: flex; justify-content: space-between; }
                   /* --- CODE BLOCKS --- */
                   /* Make code blocks split naturally across pages */
                pre code {
                  white-space: pre-wrap;
                  word-break: break-word;
                  overflow-wrap: anywhere;
                  display: block;
                  break-inside: auto;
                  page-break-inside: auto;
                }
                pre code {
                  border: 1px solid #ddd;
                  padding: 0.5rem;
                  background: #f9f9f9;
                  font-size: 0.9rem;
                  line-height: 1.4;
                }
              </style>
            </head>
            <body>
              <h1>Table of Contents</h1>
              <div id="toc"></div>
                ${content}
                ${tocScripts}
            </body>
          </html>
  `;
    }

    private static changeTaskHeaders(task: string): string {
        return task
            .replace(/## /g, "### ")
            .replace(/# /g, "### ");
    }
}