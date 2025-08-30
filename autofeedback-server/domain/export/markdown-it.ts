import MarkdownIt from "markdown-it";
import multimdTable from "markdown-it-multimd-table-ext";

const md = new MarkdownIt({
    html: true,

})
    .enable("table")
    .use(multimdTable, {
        multiline: true,   // allow line breaks inside cells
        rowspan: true,     // enable rowspan
        headerless: true,  // allow tables without header row
    })
export default md;