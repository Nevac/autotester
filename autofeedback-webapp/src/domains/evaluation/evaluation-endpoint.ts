import {EvaluationListItem} from "./evaluation-list-item";
import {Evaluation} from "./evaluation";
import {Llm} from "../llms/llm";
import ConfusionDto from "./score/confusion/confusion-dto";

export default class EvaluationEndpoint {

    private readonly RESOURCE_NAME: string = 'evaluation'
    private readonly ENDPOINT = `${process.env.REACT_APP_API}/${this.RESOURCE_NAME}`

    constructor() {
    }

    public getListItemsByEvaluationGroupId(evaluationGroupId: string, llm: Llm): Promise<EvaluationListItem[]> {
        return fetch(`${this.ENDPOINT}?evaluationGroupId=${evaluationGroupId}&llm=${llm}`)
            .then((res) => {
                return res.json();
            })
    }

    public getById(id: string): Promise<Evaluation> {
        return fetch(`${this.ENDPOINT}/${id}`)
            .then(res => {
                return res.json();
            });
    }

    public confusion(id: string, confusion: ConfusionDto): Promise<Evaluation> {
        return fetch(`${this.ENDPOINT}/${id}/confusion`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(confusion)
        }).then(res => res.json());
    }
}