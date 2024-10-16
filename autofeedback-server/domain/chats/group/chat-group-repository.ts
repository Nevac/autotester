import {ChatGroup, ChatGroupModel} from "./chat-group";

export default class ChatGroupRepository {

    public async getAll(): Promise<ChatGroup[]> {
        return await ChatGroupModel.find()
            .exec()
            .then(res => Array.from(res))
    }

    public async create(chatGroup: ChatGroup): Promise<ChatGroup> {
        return await ChatGroupModel.create(
            chatGroup
        ).then(chatGroup => chatGroup)
    }
}