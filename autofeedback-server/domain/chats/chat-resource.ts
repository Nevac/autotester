import {Application} from "express";
import ChatService from "./chat-service";

export default class ChatResource {

    private readonly service: ChatService;
    private readonly RESOURCE: string = 'chat';

    constructor(
        private readonly app: Application,
    ) {
        this.service = new ChatService();

        app.get(`/${this.RESOURCE}`, async (req, res, next) => {
            const chatGroupId = req.query.chatGroupId as string;

            if(chatGroupId) {
                const list = await this.service.getAllListEntriesByChatGroupId(chatGroupId);
                res.json(list);
            } else {
                res.json([]);
            }
        });

        app.get(`/${this.RESOURCE}/:id`, async (req, res, next) => {
            const exercise = await this.service.getById(req.params.id).catch(next);
            res.json(exercise);
        });

        app.post(`/${this.RESOURCE}`, async (req, res, next) => {
            const chat = await this.service.create(req.body).catch(next);
            res.json(chat);
        });

        app.delete(`/${this.RESOURCE}/:id`, async (req, res, next) => {
            const deleted = await this.service.delete(req.params.id).catch(next);
            if(deleted) res.sendStatus(200);
            else res.sendStatus(409);
        });
    }
}