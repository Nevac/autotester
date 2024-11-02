import {ExerciseModel, Exercise} from "./exercise";
import ExerciseUpdate from "./exercise-update";
import ExerciseListEntry from "./exercise-list-entry";

export default class ExerciseRepository {

    public async getAll(): Promise<Exercise[]> {
        return await ExerciseModel.find()
            .exec()
            .then(res =>
                res.map(document =>
                    Exercise.ofDocument(document)
                ))
    }

    public async getAllListEntries(): Promise<ExerciseListEntry[]> {
        return await ExerciseModel.find()
            .select('_id name createdAt')
            .sort({createdAt: "desc"})
            .exec()
            .then(documents =>
                documents.map(document =>
                    ExerciseListEntry.ofDocument(document)
                ))
    }

    public async getById(id: string): Promise<Exercise> {
        return await ExerciseModel.findById(id)
            .exec()
            .then(document => {
                if (document) return Exercise.ofDocument(document);
                throw `Exercise with id ${id} not found`
            });
    }

    public async create(exercise: ExerciseUpdate): Promise<Exercise> {
        return await ExerciseModel.create(
            exercise
        ).then(document => {
            return Exercise.ofDocument(document)
        })
    }

    public async update(id: string, exercise: ExerciseUpdate): Promise<Exercise> {
        return await ExerciseModel.updateOne(
            {_id: id},
            exercise
        )
            .exec()
            .then(document => {
                return this.getById(id)
            })
    }

    public async delete(id: string): Promise<boolean> {
        return await ExerciseModel.deleteOne(
            {_id: id}
        )
            .exec()
            .then(document => {
                return document.acknowledged;
            })
    }
}