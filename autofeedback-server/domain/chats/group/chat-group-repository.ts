import {ChatGroupModel, ChatGroup} from "./chat-group";
import ChatGroupListEntry from "./chat-group-list-entry";
import ChatGroupUpdate from "./chat-group-update";


export default class ChatGroupRepository {

    public async getAll(): Promise<ChatGroup[]> {
        return await ChatGroupModel.find()
            .exec()
            .then(documents => documents.map(
                document =>
                    ChatGroup.ofDocument(document)
            ))
    }

    public async getAllListEntries(): Promise<ChatGroupListEntry[]> {
        return await ChatGroupModel.find()
            .select('_id name exercise promptGroup createdAt')
            .sort({createdAt: "desc"})
            .exec()
            .then(documents =>
                documents.map(document =>
                    ChatGroupListEntry.ofDocument(document)
                ))
    }

    public async getById(id: string): Promise<ChatGroup> {
        return await ChatGroupModel.findById(id)
            .exec()
            .then(document => {
                if (document) return ChatGroup.ofDocument(document);
                throw `Exercise with id ${id} not found`
            });
    }

    public async create(chatGroup: ChatGroupUpdate): Promise<ChatGroup> {
        return await ChatGroupModel.create(
            chatGroup
        ).then(document =>
            ChatGroup.ofDocument(document)
        )
    }

    public async delete(id: string): Promise<boolean> {
        return await ChatGroupModel.deleteOne(
            {_id: id}
        )
            .exec()
            .then(document => {
                return document.acknowledged;
            })
    }
}