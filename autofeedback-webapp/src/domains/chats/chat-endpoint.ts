import {ChatListItem} from "./chat-list-item";
import {Chat} from "./chat";
import {EndpointResponeStatus} from "../util/EndpointResponeStatus";
import ChatUpdate from "./chat-update";

export default class ChatEndpoint {

    private readonly RESOURCE_NAME: string = 'chat'
    private readonly ENDPOINT = `${process.env.REACT_APP_API}/${this.RESOURCE_NAME}`

    constructor() {
    }

    public getListItemsByChatGroupId(chatGroupId: string): Promise<ChatListItem[]> {
        return fetch(`${this.ENDPOINT}?chatGroupId=${chatGroupId}`)
            .then((res) => {
                return res.json();
            })
    }

    public getById(id: string): Promise<Chat> {
        return fetch(`${this.ENDPOINT}/${id}`)
            .then(res => {
                return res.json();
            });
    }

    public create(chat: ChatUpdate): Promise<EndpointResponeStatus> {
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