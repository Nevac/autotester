import RagDocumentListEntry from "./rag-document-list-entry";
import RagDoc, {RagDocModel} from "./rag-doc";
import RagDocumentUpsert from "./rag-document-upsert";

export default class RagDocumentRepository {

    public async getAll(): Promise<RagDoc[]> {
        return await RagDocModel.find()
            .exec()
            .then(res =>
                res.map(document =>
                    RagDoc.ofDocument(document)
                ))
    }

    public async getAllListEntries(): Promise<RagDocumentListEntry[]> {
        return await RagDocModel.find()
            .select('_id externalId createdAt')
            .sort({createdAt: "desc"})
            .exec()
            .then(documents =>
                documents.map(document =>
                    RagDocumentListEntry.ofDocument(document)
                ))
    }

    public async getById(id: string): Promise<RagDoc> {
        return await RagDocModel.findById(id)
            .exec()
            .then(document => {
                if (document) return RagDoc.ofDocument(document);
                throw `RagDocument with id ${id} not found`
            });
    }

    public async getByIds(ids: string[]): Promise<Map<string, RagDoc>> {
        return await RagDocModel.find({ _id: { $in: ids }})
            .exec()
            .then(documents => RagDoc.ofDocumentsToMap(documents));
    }

    public async create(ragUpdate: RagDocumentUpsert): Promise<RagDoc> {
        return await RagDocModel.create(
            ragUpdate
        ).then(document => {
            return RagDoc.ofDocument(document)
        })
    }

    public async update(id: string, update: RagDocumentUpsert): Promise<RagDoc> {
        return await RagDocModel.updateOne(
            {_id: id},
            update
        )
            .exec()
            .then(document => {
                return this.getById(id)
            })
    }

    public async delete(id: string): Promise<boolean> {
        return await RagDocModel.deleteOne(
            {_id: id}
        )
            .exec()
            .then(document => {
                return document.acknowledged;
            })
    }
}