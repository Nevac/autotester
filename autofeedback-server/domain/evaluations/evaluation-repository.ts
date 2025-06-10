import EvaluationListEntry from "./evaluation-list-entry";
import {Evaluation, EvaluationModel} from "./evaluation";
import EvaluationUpdate from "./evaluation-update";


export default class EvaluationRepository {

    public async getAll(): Promise<Evaluation[]> {
        return await EvaluationModel.find()
            .exec()
            .then(documents => documents.map(
                document =>
                    Evaluation.ofDocument(document)
            ))
    }

    public async getAllListEntries(): Promise<EvaluationListEntry[]> {
        return await EvaluationModel.find()
            .select('_id name state score createdAt')
            .sort({createdAt: "desc"})
            .exec()
            .then(documents =>
                documents.map(document =>
                    EvaluationListEntry.ofDocument(document)
                ))
    }

    public async getById(id: string): Promise<Evaluation> {
        return await EvaluationModel.findById(id)
            .exec()
            .then(document => {
                if (document) return Evaluation.ofDocument(document);
                throw `Exercise with id ${id} not found`
            });
    }

    public async create(evaluation: EvaluationUpdate): Promise<Evaluation> {
        return await EvaluationModel.create(
            evaluation
        ).then(document =>
            Evaluation.ofDocument(document)
        )
    }

    public async createAll(evaluations: EvaluationUpdate[]): Promise<Map<string, Evaluation>> {
        return await EvaluationModel.create(
            evaluations
        ).then(documents =>
            Evaluation.ofDocuments(documents)
        )
    }

    public async delete(id: string): Promise<boolean> {
        return await EvaluationModel.deleteOne(
            {_id: id}
        )
            .exec()
            .then(document => {
                return document.acknowledged;
            })
    }
}