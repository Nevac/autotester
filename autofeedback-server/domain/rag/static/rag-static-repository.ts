import RagStatic, {RagStaticModel} from "./rag-static";
import RagStaticListEntry from "./rag-static-list-entry";
import RagStaticUpdate from "./rag-static-update";

export default class RagStaticRepository {

    public async getAll(): Promise<RagStatic[]> {
        return await RagStaticModel.find()
            .exec()
            .then(res =>
                res.map(document =>
                    RagStatic.ofDocument(document)
                ))
    }

    public async getAllListEntries(): Promise<RagStaticListEntry[]> {
        return await RagStaticModel.find()
            .select('_id name createdAt')
            .sort({createdAt: "desc"})
            .exec()
            .then(documents =>
                documents.map(document =>
                    RagStaticListEntry.ofDocument(document)
                ))
    }

    public async getById(id: string): Promise<RagStatic> {
        return await RagStaticModel.findById(id)
            .exec()
            .then(document => {
                if (document) return RagStatic.ofDocument(document);
                throw `RagStatic with id ${id} not found`
            });
    }

    public async create(ragStaticUpdate: RagStaticUpdate): Promise<RagStatic> {
        return await RagStaticModel.create(
            ragStaticUpdate
        ).then(document => {
            return RagStatic.ofDocument(document)
        })
    }

    public async update(id: string, update: RagStaticUpdate): Promise<RagStatic> {
        return await RagStaticModel.updateOne(
            {_id: id},
            update
        )
            .exec()
            .then(document => {
                return this.getById(id)
            })
    }

    public async delete(id: string): Promise<boolean> {
        return await RagStaticModel.deleteOne(
            {_id: id}
        )
            .exec()
            .then(document => {
                return document.acknowledged;
            })
    }
}