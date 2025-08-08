import EvaluationListEntry from "./evaluation-list-entry";
import {Evaluation, EvaluationModel} from "./evaluation";
import EvaluationUpdate from "./evaluation-update";
import {EvaluationGroup} from "./group/evaluation-group";
import {Llm} from "../llms/llm";
import {Attempt, AttemptModel} from "../attempts/attempt";


export default class EvaluationRepository {

    public async getAll(): Promise<Evaluation[]> {
        return await EvaluationModel.find()
            .exec()
            .then(documents => documents.map(
                document =>
                    Evaluation.ofDocument(document)
            ))
    }

    public async getAllListEntries(evaluationGroupId: string, llm: Llm): Promise<EvaluationListEntry[]> {
        return await EvaluationModel.find({
            evaluationGroup: evaluationGroupId,
            llm: llm
        })
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
                throw `Evaluation with id ${id} not found`
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

    public async update(id: string, evaluation: EvaluationUpdate): Promise<Evaluation> {
        return await EvaluationModel.updateOne(
            {_id: id},
            evaluation
        )
            .exec()
            .then(document => {
                return this.getById(id)
            })
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

    public async deleteAllByGroup(evaluationGroupId: string): Promise<boolean> {
        return await EvaluationModel.deleteMany(
            {evaluationGroup: evaluationGroupId}
        )
            .exec()
            .then(document => {
                return document.acknowledged;
            })
    }
}