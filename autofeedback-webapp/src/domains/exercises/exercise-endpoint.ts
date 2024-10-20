import ExerciseListItem from "./exercise-list-item";
import ExerciseUpdate from "./exercise-update";
import {EndpointCreationStatus} from "../util/EndpointCreationStatus";

export default class ExerciseEndpoint {

    private readonly RESOURCE_NAME: string = 'exercise'
    private readonly ENDPOINT = `${process.env.REACT_APP_API}/${this.RESOURCE_NAME}`

    public getListItems(): Promise<ExerciseListItem[]> {
        return fetch(this.ENDPOINT)
            .then((res) => {
                return res.json();
            })
    }

    public create(chat: ExerciseUpdate): Promise<EndpointCreationStatus> {
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