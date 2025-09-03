import EvaluationGroupListItem from "./evaluation-group-list-item";
import {EndpointResponeStatus} from "../../util/EndpointResponeStatus";
import EvaluationGroupUpdate from "./evaluation-group-update";
import {EvaluationGroup} from "./evaluation-group";
import CorrectScoreDto from "../score/correction/correct-score-dto";
import {Evaluation} from "../evaluation";
import FileDownloader from "../../util/file-downloader/file-downloader";
import EvaluationGroupStatistic from "./evaluation-group-statistics/statistic/evaluation-group-statistic";

export default class EvaluationGroupEndpoint {

    private readonly RESOURCE_NAME: string = 'evaluation-group'
    private readonly ENDPOINT = `${process.env.REACT_APP_API}/${this.RESOURCE_NAME}`

    constructor() {
    }

    public getListItems(): Promise<EvaluationGroupListItem[]> {
        return fetch(this.ENDPOINT)
            .then((res) => {
                return res.json();
            })
    }

    public getById(id: string): Promise<EvaluationGroup> {
        return fetch(`${this.ENDPOINT}/${id}`)
            .then(res => {
                return res.json();
            })
            .then(json => EvaluationGroup.fromJSON(json));
    }

    public create(chat: EvaluationGroupUpdate): Promise<EndpointResponeStatus> {
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

    public retryFailed(id: string): Promise<EndpointResponeStatus> {
        return fetch(`${this.ENDPOINT}/${id}/retryFailed`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.ok) return EndpointResponeStatus.SUCCESS
            return EndpointResponeStatus.FAIL;
        })
    }

    public calculateScore(id: string): Promise<EndpointResponeStatus> {
        return fetch(`${this.ENDPOINT}/${id}/calculateScore`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.ok) return EndpointResponeStatus.SUCCESS
            return EndpointResponeStatus.FAIL;
        })
    }

    public correctScore(id: string, correctScoreDto: CorrectScoreDto): Promise<Evaluation> {
        return fetch(`${this.ENDPOINT}/${id}/correctScore`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(correctScoreDto)
        }).then(res => res.json());
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

    public export(ids: string[]): Promise<void> {
        return fetch(`${this.ENDPOINT}/export`,{
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ids: ids})
        }).then(async (res) => {
            if (!res.ok) throw new Error("Failed to export");
            await FileDownloader.pdf("evaluation", res)
        });
    }

    public statistics(baseEvaluationGroupId: string, evaluationGroupsToCompareIds: string[]): Promise<EvaluationGroupStatistic> {
        return fetch(`${this.ENDPOINT}/statistics`,{
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                evaluationGroupBaseId: baseEvaluationGroupId,
                evaluationGroupCompareIds: evaluationGroupsToCompareIds
            })
        }).then(async (res) => res.json());
    }
}