import EvaluationGroupListEntry from "./evaluation-group-list-entry";
import {EvaluationGroup, EvaluationGroupModel} from "./evaluation-group";
import EvaluationGroupUpsert from "./evaluation-group-upsert";
import AttemptUpdate from "../../attempts/attempt-update";
import {Attempt, AttemptModel} from "../../attempts/attempt";
import EvaluationUpdate from "../evaluation-update";
import {Evaluation, EvaluationModel} from "../evaluation";


export default class EvaluationGroupRepository {

    public async getAll(): Promise<EvaluationGroup[]> {
        return await EvaluationGroupModel.find()
            .exec()
            .then(documents => documents.map(
                document =>
                    EvaluationGroup.ofDocument(document)
            ))
    }

    public async getAllListEntries(): Promise<EvaluationGroupListEntry[]> {
        return await EvaluationGroupModel.find()
            .select('_id name state bestScore bestLlm createdAt')
            .sort({createdAt: "desc"})
            .exec()
            .then(documents =>
                documents.map(document =>
                    EvaluationGroupListEntry.ofDocument(document)
                ))
    }

    public async getById(id: string): Promise<EvaluationGroup> {
        return await EvaluationGroupModel.findById(id)
            .exec()
            .then(document => {
                if (document) return EvaluationGroup.ofDocument(document);
                throw `Evaluation Group with id ${id} not found`
            });
    }

    public async create(upsert: EvaluationGroupUpsert): Promise<EvaluationGroup> {
        return await EvaluationGroupModel.create(
            upsert
        ).then(document =>
            EvaluationGroup.ofDocument(document)
        )
    }

    public async update(id: string, upsert: EvaluationGroupUpsert): Promise<EvaluationGroup> {
        return await EvaluationGroupModel.updateOne(
            {_id: id},
            upsert
        )
            .exec()
            .then(document => {
                return this.getById(id)
            })
    }

    public async delete(id: string): Promise<boolean> {
        return await EvaluationGroupModel.deleteOne(
            {_id: id}
        )
            .exec()
            .then(document => {
                return document.acknowledged;
            })
    }
}