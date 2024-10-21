import ExerciseListItem from "./exercise-list-item";
import ExerciseUpdate from "./exercise-update";
import {EndpointResponeStatus} from "../util/EndpointResponeStatus";
import Exercise from "./exercise";

export default class ExerciseEndpoint {

    private readonly RESOURCE_NAME: string = 'exercise'
    private readonly ENDPOINT = `${process.env.REACT_APP_API}/${this.RESOURCE_NAME}`

    public getListItems(): Promise<ExerciseListItem[]> {
        return fetch(this.ENDPOINT)
            .then((res) => {
                return res.json();
            });
    }

    public getById(id: string): Promise<Exercise> {
        return fetch(`${this.ENDPOINT}/${id}`)
            .then(res => {
                return res.json();
            });
    }

    public create(exerciseUpdate: ExerciseUpdate): Promise<EndpointResponeStatus> {
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

    public update(id: string, exerciseUpdate: ExerciseUpdate): Promise<EndpointResponeStatus> {
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