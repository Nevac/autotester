import EvaluationGroupListEntry from "./evaluation-group-list-entry";
import {EvaluationGroup, EvaluationGroupModel} from "./evaluation-group";
import EvaluationGroupUpdate from "./evaluation-group-update";


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
            .select('_id name state score createdAt')
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
                throw `Exercise with id ${id} not found`
            });
    }

    public async create(chatGroup: EvaluationGroupUpdate): Promise<EvaluationGroup> {
        return await EvaluationGroupModel.create(
            chatGroup
        ).then(document =>
            EvaluationGroup.ofDocument(document)
        )

        EvaluationGroupModel.create
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