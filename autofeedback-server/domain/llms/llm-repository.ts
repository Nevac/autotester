import {Llm, LlmModel} from "./llm-obsolete";

export default class LlmRepository {
    public async getAll(): Promise<Llm[]> {
        return await LlmModel.find()
            .exec()
            .then(documents => documents.map(
                document =>
                    Llm.ofDocument(document)
            ))
    }

    public async getById(id: string): Promise<Llm> {
        return await LlmModel.findById(id)
            .exec()
            .then(document => {
                if (document) return Llm.ofDocument(document);
                throw `Chat with id ${id} not found`
            });
    }
}