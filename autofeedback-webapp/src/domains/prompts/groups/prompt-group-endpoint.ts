import PromptGroupListItem from "./prompt-group-list-item";
import PromptGroupUpdate from "./prompt-group-update";
import {EndpointResponeStatus} from "../../util/EndpointResponeStatus";
import Exercise from "../../exercises/exercise";
import PromptGroup from "./prompt-group";

export default class PromptGroupEndpoint {

    private readonly RESOURCE_NAME: string = 'prompt-group'
    private readonly ENDPOINT = `${process.env.REACT_APP_API}/${this.RESOURCE_NAME}`

    public getListItems(): Promise<PromptGroupListItem[]> {
        return fetch(this.ENDPOINT)
            .then((res) => {
                return res.json();
            })
    }

    public getById(id: string): Promise<PromptGroup> {
        return fetch(`${this.ENDPOINT}/${id}`)
            .then(res => {
                return res.json();
            });
    }

    public create(promptGroupUpdate: PromptGroupUpdate): Promise<EndpointResponeStatus> {
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

    public update(id: string, promptGroupUpdate: PromptGroupUpdate): Promise<EndpointResponeStatus> {
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