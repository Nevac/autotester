import PromptGroupListItem from "./prompt-group-list-item";
import PromptGroupUpdate from "./prompt-group-update";
import {EndpointCreationStatus} from "../../util/EndpointCreationStatus";

export default class PromptGroupEndpoint {

    private readonly RESOURCE_NAME: string = 'prompt-group'
    private readonly ENDPOINT = `${process.env.REACT_APP_API}/${this.RESOURCE_NAME}`

    public getListItems(): Promise<PromptGroupListItem[]> {
        return fetch(this.ENDPOINT)
            .then((res) => {
                return res.json();
            })
    }

    public create(chat: PromptGroupUpdate): Promise<EndpointCreationStatus> {
        console.log(chat);
        return fetch(this.ENDPOINT, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chat)
        }).then(res => {
            if(res.ok) return EndpointCreationStatus.SUCCESS
            return EndpointCreationStatus.FAIL;
        })
    }

}