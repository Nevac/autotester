import ChatGroupListItem from "./chat-group-list-item";
import {EndpointResponeStatus} from "../../util/EndpointResponeStatus";
import ChatGroupUpdate from "./chat-group-update";

export default class ChatGroupEndpoint {

    private readonly RESOURCE_NAME: string = 'chat-group'
    private readonly ENDPOINT = `${process.env.REACT_APP_API}/${this.RESOURCE_NAME}`

    constructor() {
    }

    public getListItems(): Promise<ChatGroupListItem[]> {
        return fetch(this.ENDPOINT)
            .then((res) => {
                return res.json();
            })
    }

    public create(chat: ChatGroupUpdate): Promise<EndpointResponeStatus> {
        console.log(chat);
        return fetch(this.ENDPOINT, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chat)
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