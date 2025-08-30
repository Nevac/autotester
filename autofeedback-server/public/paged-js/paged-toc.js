class TocHandler extends Paged.Handler {
    afterRendered(pages) {
        const toc = document.querySelector("#toc");
        toc.innerHTML = "";

        let h1Count = 0, h2Count = 0;

        pages.forEach((page, i) => {
            page.element.querySelectorAll("h1, h2").forEach(heading => {
                let text = heading.textContent.trim();
                if(text !== "Table of Contents") {
                    let pageNum = i + 1;
                    if (heading.tagName === "H1") {
                        h1Count++;
                        h2Count = 0;
                        const num = `${text}`;
                        toc.appendChild(makeEntry(num, pageNum, "h1", 0));
                    }

                    if (heading.tagName === "H2") {
                        h2Count++;
                        const num = `${text}`;
                        toc.appendChild(makeEntry(num, pageNum, "h2", 1));
                    }
                }
            });
        });

        function createTabbing(level) {
            return `<div style="width: ${level * 20}px"></div>`
        }

        function makeEntry(label, page, cls, level) {
            const div = document.createElement("div");
            div.className = `toc-entry ${cls}`;
            div.innerHTML = `
    ${createTabbing(level)}
    <span>${label}</span>
    <div style="flex: 1; border-bottom: solid 1px"></div>
    <span>${page}</span>
        `;
            return div;
        }
    }
}

Paged.registerHandlers(TocHandler);