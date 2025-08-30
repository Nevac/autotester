import AttemptListEntry from "./attempt-list-entry";
import {Attempt, AttemptModel} from "./attempt";
import AttemptUpdate from "./attempt-update";
import {Exercise, ExerciseModel} from "../exercises/exercise";


export default class AttemptRepository {

    public async getAll(): Promise<Attempt[]> {
        return await AttemptModel.find()
            .exec()
            .then(documents => documents.map(
                document =>
                    Attempt.ofDocument(document)
            ))
    }

    public async findAllByIds(ids: string[]): Promise<Map<string, Attempt>> {
        return AttemptModel.find({_id: { $in: ids}})
            .exec()
            .then(documents =>
                Attempt.ofDocumentsToMap(documents)
            );
    }

    public async getAllListEntries(): Promise<AttemptListEntry[]> {
        return await AttemptModel.find()
            .select('_id name exercise attempt createdAt')
            .sort({createdAt: "desc"})
            .exec()
            .then(documents =>
                documents.map(document =>
                    AttemptListEntry.ofDocument(document)
                ))
    }

    public async getById(id: string): Promise<Attempt> {
        return await AttemptModel.findById(id)
            .exec()
            .then(document => {
                if (document) return Attempt.ofDocument(document);
                throw `Attempt with id ${id} not found`
            });
    }

    public async getByIds(ids: Set<string>): Promise<Map<string, Attempt>> {
        return await AttemptModel.find({ _id: { $in: ids }})
            .exec()
            .then(documents => Attempt.ofDocumentsToMap(documents));
    }

    public async create(chatGroup: AttemptUpdate): Promise<Attempt> {
        return await AttemptModel.create(
            chatGroup
        ).then(document =>
            Attempt.ofDocument(document)
        )
    }

    public async update(id: string, exercise: AttemptUpdate): Promise<Attempt> {
        return await AttemptModel.updateOne(
            {_id: id},
            exercise
        )
            .exec()
            .then(document => {
                return this.getById(id)
            })
    }

    public async delete(id: string): Promise<boolean> {
        return await AttemptModel.deleteOne(
            {_id: id}
        )
            .exec()
            .then(document => {
                return document.acknowledged;
            })
    }


}