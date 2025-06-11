import AttemptListItem from "./attempt-list-item";
import AttemptUpdate from "./attempt-update";
import {EndpointResponeStatus} from "../util/EndpointResponeStatus";
import Attempt from "./attempt";

export default class AttemptEndpoint {

    private readonly RESOURCE_NAME: string = 'attempt'
    private readonly ENDPOINT = `${process.env.REACT_APP_API}/${this.RESOURCE_NAME}`

    public getListItems(): Promise<AttemptListItem[]> {
        return fetch(this.ENDPOINT)
            .then((res) => {
                return res.json();
            });
    }

    public getById(id: string): Promise<Attempt> {
        return fetch(`${this.ENDPOINT}/${id}`)
            .then(res => {
                return res.json();
            });
    }

    public create(exerciseUpdate: AttemptUpdate): Promise<EndpointResponeStatus> {
        return fetch(this.ENDPOINT, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exerciseUpdate)
        }).then(res => {
            if(res.ok) return EndpointResponeStatus.SUCCESS
            return EndpointResponeStatus.FAIL;
        });
    }

    public update(id: string, exerciseUpdate: AttemptUpdate): Promise<EndpointResponeStatus> {
        return fetch(`${this.ENDPOINT}/${id}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(exerciseUpdate)
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