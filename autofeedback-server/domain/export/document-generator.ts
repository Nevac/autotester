import puppeteer from "puppeteer";
import path from "node:path";
import fs from "node:fs";
import DateFormatter from "../util/date-formatter";

export default class DocumentGenerator {

    public static async pdf(
        title: string,
        content: string
    ): Promise<Buffer> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(this.generateDocumentHtml(title, content), { waitUntil: "networkidle0" });

        const logoPath = path.join(process.cwd(), "public/fh_header.png");
        const logoBase64 = fs.readFileSync(logoPath).toString("base64");
        const logoDataUri = `data:image/png;base64,${logoBase64}`;

        const pdf = await page.pdf({
            format: "A4",
            displayHeaderFooter: true,
            headerTemplate: `
                <div style="font-size:11pt; text-align:start; width:100%; padding: 0 40px">
                    <img style="height: 50px" src="${logoDataUri}"/>
                </div>`,
            footerTemplate: `
                <div style="font-size:11pt; text-align:end; width:100%; padding: 40px">
                  <span class="pageNumber"></span> von <span class="totalPages"></span>
                </div>`,
            margin: { top: "40px", bottom: "40px", left: "40px", right: "40px" }
        })
        await browser.close();

        return pdf as Buffer;
    }

    private static generateDocumentHtml(
        title: string,
        content: string
    ): string {
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
                body { font-family: "Arial", sans-serif; font-size: 11pt; margin: 2rem; }
                h1, h2, h3 { page-break-after: avoid; }
                #toc { margin-bottom: 2rem;}
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
                
                /* --- PAGE TYPES --- */
                .cover {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: start;
                  margin-bottom: 50px;
                }
                
                .toc-page {
                  page-break-after: always;
                }
                
                .toc-title {
                    font-size: 13pt;
                    font-weight: bold;
                }
                
                .blank-page {
                  page-break-after: always;
                }
                
                table {
                  width: 100%;
                  border-collapse: collapse;   /* make borders merge nicely */
                  margin: 1rem 0;
                  font-size: 10pt;
                }
                
                th, td {
                  border: 1px solid #333;      /* <-- table lines */
                  padding: 6px 10px;
                  text-align: left;
                }
                
                th {
                  background-color: #f2f2f2;
                }
                
                .cover-tilte { font-size: 20pt; font-weight: bold; line-height: 2}
              </style>
            </head>
            <body>
              <!-- Cover Page -->
              <div class="cover">
                <div class="cover-tilte">Autofeedback</div>
                <div class="cover-tilte">${title}</div>
                <div style="margin-bottom: 50px"></div>
                <div style="display: flex; flex-direction: column; gap: 10px; font-size: 14pt">
                    <div style="display: flex; flex-direction: row;">
                        <div style="width: 150px">Autor:in</div>
                        <div>Cagatay Özyurt</div>
                    </div>
                    <div style="display: flex; flex-direction: row;">
                        <div style="width: 150px;">Ort, Datum</div>
                        <div>Windisch, ${DateFormatter.now()}</div>
                    </div>
                </div>

              </div>
            
              <!-- TOC -->
              <div class="toc-page">
                <div class="toc-title">Inhaltsverzeichnis</div>
                <div id="toc"></div>
              </div>
            
              <!-- Main Content -->
              ${content}
            
              <!-- Paged.js script -->
              ${tocScripts}
           
            </body>
          </html>
        `;
    }

}