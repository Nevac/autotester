import PromptGroupListEntry from "./prompt-group-list-entry";
import PromptGroup, {PromptGroupModel} from "./promptGroup";
import PromptGroupUpdate from "./prompt-group-update";

export default class PromptGroupRepository {

    public async getAll(): Promise<PromptGroup[]> {
        return await PromptGroupModel.find()
            .exec()
            .then(res =>
                res.map(document =>
                    PromptGroup.ofDocument(document)
                ))
    }

    public async getAllListEntries(): Promise<PromptGroupListEntry[]> {
        return await PromptGroupModel.find()
            .select('_id name createdAt')
            .exec()
            .then(documents =>
                documents.map(document =>
                    PromptGroupListEntry.ofDocument(document)
                ))
    }

    public async getById(id: string): Promise<PromptGroup> {
        return await PromptGroupModel.findById(id)
            .exec()
            .then(document => {
                if (document) return PromptGroup.ofDocument(document);
                throw `PromptGroup with id ${id} not found`
            });
    }

    public async create(promptGroupUpdate: PromptGroupUpdate): Promise<PromptGroup> {
        return await PromptGroupModel.create(
            promptGroupUpdate
        ).then(document => {
            return PromptGroup.ofDocument(document)
        })
    }
}