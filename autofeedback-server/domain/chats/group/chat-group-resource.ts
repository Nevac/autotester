import {Application} from "express";
import ChatGroupUpdateDto from "./chat-group-update-dto";
import { Request } from 'express';
import ChatGroupService from "./chat-group-service";
import {coerceBoolean} from "openai/core";

export default class ChatGroupResource {

    private readonly service: ChatGroupService
    private readonly RESOURCE: string = 'chat-group'

    constructor(
        private readonly app: Application,
    ) {
        this.service = new ChatGroupService();

        app.get(`/${this.RESOURCE}`, async (req, res, next) => {
            const populate = req.query.populate ? coerceBoolean(req.query.populate as string) : false;

            if(populate) {
                const list = await this.service.getAll().catch(next);
                res.json(list);
            }
            else {
                const list = await this.service.getAllListEntries().catch(next);
                res.json(list);
            }
        });

        app.post(`/${this.RESOURCE}`, async (req, res, next) => {
            const chatGroup = await this.service.create(req.body).catch(next);
            res.json(chatGroup);
        });

        app.delete(`/${this.RESOURCE}/:id`, async (req, res, next) => {
            const deleted = await this.service.delete(req.params.id).catch(next);
            if(deleted) res.sendStatus(200);
            else res.sendStatus(409);
        });
    }
}