import {Application} from "express";
import { Request } from 'express';
import PromptGroupService from "./prompt-group-service";
import PromptGroupUpdate from "./prompt-group-update";
import {coerceBoolean} from "openai/core";
import ExerciseUpdate from "../exercises/exercise-update";

export default class PromptGroupResource {

    private readonly service: PromptGroupService
    private readonly RESOURCE: string = 'prompt-group'

    constructor(
        private readonly app: Application,
    ) {
        this.service = new PromptGroupService();

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

        app.get(`/${this.RESOURCE}/:id`, (req, res) => {
            this.service.getById(req.params.id).then(
                exercise => {
                    res.json(exercise)
                }
            );
        });

        app.post(`/${this.RESOURCE}`, (req: Request<{}, {}, PromptGroupUpdate>, res) => {
            this.service.create(
                req.body
            ).then(exercise =>
                res.json(exercise)
            );
        });

        app.put(`/${this.RESOURCE}/:id`, (req: Request<{id: string}, {}, PromptGroupUpdate>, res) => {
            this.service.update(
                req.params.id,
                req.body
            ).then(exercise =>
                res.json(exercise)
            );
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