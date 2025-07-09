import RagGroupListEntry from "./rag-group-list-entry";
import Rag, {RagModel} from "./rag";
import RagUpdate from "./rag-update";

export default class RagRepository {

    public async getAll(): Promise<Rag[]> {
        return await RagModel.find()
            .exec()
            .then(res =>
                res.map(document =>
                    Rag.ofDocument(document)
                ))
    }

    public async getAllListEntries(): Promise<RagGroupListEntry[]> {
        return await RagModel.find()
            .select('_id name createdAt')
            .sort({createdAt: "desc"})
            .exec()
            .then(documents =>
                documents.map(document =>
                    RagGroupListEntry.ofDocument(document)
                ))
    }

    public async getById(id: string): Promise<Rag> {
        return await RagModel.findById(id)
            .exec()
            .then(document => {
                if (document) return Rag.ofDocument(document);
                throw `PromptGroup with id ${id} not found`
            });
    }

    public async create(promptGroupUpdate: RagUpdate): Promise<Rag> {
        return await RagModel.create(
            promptGroupUpdate
        ).then(document => {
            return Rag.ofDocument(document)
        })
    }

    public async update(id: string, update: RagUpdate): Promise<Rag> {
        return await RagModel.updateOne(
            {_id: id},
            update
        )
            .exec()
            .then(document => {
                return this.getById(id)
            })
    }

    public async delete(id: string): Promise<boolean> {
        return await RagModel.deleteOne(
            {_id: id}
        )
            .exec()
            .then(document => {
                return document.acknowledged;
            })
    }
}