export default class FileDownloader {

    public static async pdf(name: string, res: Response): Promise<void> {
        return new FileDownloader().download(name, "pdf", res);
    }

    public async download(name: string, fileEnding: string, res: Response): Promise<void> {
        // get response as a blob
        const blob = await res.blob();

        // create a temporary object URL
        const url = window.URL.createObjectURL(blob);

        // create a hidden <a> tag to trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = `${name}.${fileEnding}`; // filename
        document.body.appendChild(link);
        link.click();

        // cleanup
        link.remove();
        window.URL.revokeObjectURL(url);
    }
}