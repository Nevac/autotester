import RagListItem from "./rag-list-item";
import RagUpdate from "./rag-update";
import {EndpointResponeStatus} from "../../util/EndpointResponeStatus";
import Rag from "./rag";

export default class RagEndpoint {

    private readonly RESOURCE_NAME: string = 'rag'
    private readonly ENDPOINT = `${process.env.REACT_APP_API}/${this.RESOURCE_NAME}`

    public getListItems(): Promise<RagListItem[]> {
        return fetch(this.ENDPOINT)
            .then((res) => {
                return res.json();
            })
    }

    public getById(id: string): Promise<Rag> {
        return fetch(`${this.ENDPOINT}/${id}`)
            .then(res => {
                return res.json();
            });
    }

    public create(promptGroupUpdate: RagUpdate): Promise<EndpointResponeStatus> {
        return fetch(this.ENDPOINT, {
            method: "POST",
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

    public update(id: string, promptGroupUpdate: RagUpdate): Promise<EndpointResponeStatus> {
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
}