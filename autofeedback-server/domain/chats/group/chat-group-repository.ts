import {IChatGroup, ChatGroupModel, ChatGroup} from "./chat-group";
import ChatGroupUpdateDto from "./chat-group-update-dto";
import ExerciseListEntry from "../../exercises/exercise-list-entry";
import {Exercise, ExerciseModel} from "../../exercises/exercise";
import ChatGroupListEntry from "./chat-group-list-entry";
import PromptGroup from "../../prompts/promptGroup";
import ExerciseRepository from "../../exercises/exercise-repository";
import PromptGroupRepository from "../../prompts/prompt-group-repository";
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
            .select('_id name createdAt')
            .exec()
            .then(documents =>
                documents.map(document =>
                    ChatGroup.ofDocument(document)
                ))
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