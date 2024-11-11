import {Chat, ChatModel} from "./chat";
import {ChatListEntry} from "./chat-list-entry";
import ChatUpdateDto from "./chat-update-dto";
import ChatUpdate from "./chat-update";

export default class ChatRepository {

    public async getAllListEntriesByChatGroupId(chatGroupId: string): Promise<ChatListEntry[]> {
        return await ChatModel.find()
            .exec()
            .then(documents => documents.map(
                document =>
                    ChatListEntry.ofDocument(document)
            ))
    }

    public async getById(id: string): Promise<Chat> {
        return await ChatModel.findById(id)
            .exec()
            .then(document => {
                if (document) return Chat.ofDocument(document);
                throw `Exercise with id ${id} not found`
            });
    }

    public async create(chat: ChatUpdate): Promise<Chat> {
        return await ChatModel.create(
            chat
        ).then(document =>
            Chat.ofDocument(document)
        )
    }

    public async delete(id: string): Promise<boolean> {
        return await ChatModel.deleteOne(
            {_id: id}
        )
            .exec()
            .then(document => {
                return document.acknowledged;
            })
    }
}