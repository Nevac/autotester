import {IExercise, ExerciseModel, Exercise, ExerciseDocument} from "./exercise";
import ExerciseUpdate from "./exercise-update";
import ExerciseListEntry from "./exercise-list-entry";
import Timestamp from "../entities/timestamps/timestamp";

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
}