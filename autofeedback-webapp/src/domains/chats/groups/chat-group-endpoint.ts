import ChatListEntry from "../chat-browser/chat-list-entry";
import {EndpointCreationStatus} from "../../util/EndpointCreationStatus";
import ChatGroupCreate from "./chat-group-create/chat-group-create";

export default class ChatGroupEndpoint {

    private readonly RESOURCE_NAME: string = 'chat-group'
    private readonly ENDPOINT = `${process.env.REACT_APP_API}/${this.RESOURCE_NAME}`

    constructor() {
    }

    public getListEntries(): Promise<ChatListEntry[]> {
        return fetch(this.ENDPOINT)
            .then((res) => {
                return res.json();
            })
    }

    public create(chat: ChatGroupCreate): Promise<EndpointCreationStatus> {
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