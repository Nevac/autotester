import AttemptListEntry from "./attempt-list-entry";
import {Attempt, AttemptModel} from "./attempt";
import ChatGroupUpdate from "../chats/group/chat-group-update";
import AttemptUpdate from "./attempt-update";
import * as mongoose from "mongoose";
import {ObjectId} from "mongodb";


export default class AttemptRepository {

    public async getAll(): Promise<Attempt[]> {
        return await AttemptModel.find()
            .exec()
            .then(documents => documents.map(
                document =>
                    Attempt.ofDocument(document)
            ))
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
                throw `Exercise with id ${id} not found`
            });
    }

    public async getByIds(ids: Set<string>): Promise<Map<string, Attempt>> {
        return await AttemptModel.find({ _id: { $in: ids }})
            .exec()
            .then(documents => Attempt.ofDocuments(documents));
    }

    public async create(chatGroup: AttemptUpdate): Promise<Attempt> {
        return await AttemptModel.create(
            chatGroup
        ).then(document =>
            Attempt.ofDocument(document)
        )
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