import RagListItem from "./rag-document-list-item";
import RagDocumentUpdate from "./rag-document-update";
import {EndpointResponeStatus} from "../../util/EndpointResponeStatus";
import RagDocument from "./rag-document";
import RagDocumentListItem from "./rag-document-list-item";
import FileDownloader from "../../util/file-downloader/file-downloader";

export default class RagDocumentEndpoint {

    private readonly RESOURCE_NAME: string = 'rag-document'
    private readonly ENDPOINT = `${process.env.REACT_APP_API}/${this.RESOURCE_NAME}`

    public getListItems(): Promise<RagDocumentListItem[]> {
        return fetch(this.ENDPOINT)
            .then((res) => {
                return res.json();
            })
    }

    public getById(id: string): Promise<RagDocument> {
        return fetch(`${this.ENDPOINT}/${id}`)
            .then(res => {
                return res.json();
            });
    }

    public create(ragDocumentUpdate: RagDocumentUpdate): Promise<EndpointResponeStatus> {
        console.log(ragDocumentUpdate);
        return fetch(this.ENDPOINT, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ragDocumentUpdate)
        }).then(res => {
            if(res.ok) return EndpointResponeStatus.SUCCESS
            return EndpointResponeStatus.FAIL;
        })
    }

    public update(id: string, promptGroupUpdate: RagDocumentUpdate): Promise<EndpointResponeStatus> {
        return fetch(`${this.ENDPOINT}/${id}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(promptGroupUpdate)
        }).then(res => {
            if(res.ok) return EndpointResponeStatus.SUCCESS
            return EndpointResponeStatus.FAIL;
        })
    }

    public delete(id: string): Promise<EndpointResponeStatus> {
        return fetch(`${this.ENDPOINT}/${id}`, {
            method: "DELETE"
        })
            .then(res => {
                if(res.ok) return EndpointResponeStatus.SUCCESS
                return EndpointResponeStatus.FAIL;
            });
    }

    public export(ids: string[]): Promise<void> {
        return fetch(`${this.ENDPOINT}/export`,{
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ids: ids})
        }).then(async (res) => {
            if (!res.ok) throw new Error("Failed to export");
            await FileDownloader.pdf("rag_documents", res)
        });
    }
}