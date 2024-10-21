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

        app.get(`/${this.RESOURCE}`, (req, res) => {
            const populate = req.query.populate ? coerceBoolean(req.query.populate as string) : false;

            if(populate) {
                this.service.getAll().then(
                    list => {
                        res.json(list)
                    }
                );
            }
            else {
                this.service.getAllListEntries().then(
                    list => {
                        res.json(list)
                    }
                );
            }
        });

        app.post(`/${this.RESOURCE}`, (req: Request<{}, {}, ChatGroupUpdateDto>, res) => {
            this.service.create(
                req.body
            ).then(chatGroup =>
                res.json(chatGroup)
            )
        });

        app.delete(`/${this.RESOURCE}/:id`, (req, res) => {
            this.service.delete(req.params.id).then(
                deleted => {
                    if(deleted) res.sendStatus(200);
                    else res.sendStatus(409);
                }
            );
        });
    }
}