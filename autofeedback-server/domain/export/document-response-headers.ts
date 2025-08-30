export default class DocumentResponseHeaders {
    public static pdf(
        fileName: string,
        length: number,
        res: any
    ) {
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${fileName}.pdf`,
            "Content-Length": length
        });
    }
}