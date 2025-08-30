class TocHandler extends Paged.Handler {
    beforeParsed(content) {
        const toc = content.querySelector("#toc");
        if (!toc) return;

        const list = document.createElement("ol");
        list.className = "toc-list";

        content.querySelectorAll("h1, h2").forEach((h, i) => {
            if (!h.id) h.id = `h-${i}`;

            const li = document.createElement("li");
            li.className = `toc-${h.tagName.toLowerCase()}`;

            const a = document.createElement("a");
            a.href = `#${h.id}`;
            a.textContent = h.textContent.trim();

            li.appendChild(a);
            list.appendChild(li);
        });

        toc.innerHTML = "";
        toc.appendChild(list);
    }
}
Paged.registerHandlers(TocHandler);