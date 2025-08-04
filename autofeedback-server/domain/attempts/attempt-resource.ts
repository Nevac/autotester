import {Application, Router} from "express";
import AttemptUpdateDto from "./attempt-update-dto";
import { Request } from 'express';
import AttemptService from "./attempt-service";
import {coerceBoolean} from "openai/core";

export default class AttemptResource {

    private readonly service: AttemptService
    private readonly RESOURCE: string = 'attempt'

    constructor(
        private readonly router: Router,
    ) {
        this.service = new AttemptService();

        router.get(`/${this.RESOURCE}`, async (req, res, next) => {
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

        router.get(`/${this.RESOURCE}/:id`, async (req, res, next) => {
            const attempt = await this.service.getById(req.params.id).catch(next);
            res.json(attempt);
        });

        router.post(`/${this.RESOURCE}`, async (req, res, next) => {
            const attempt = await this.service.create(req.body).catch(next);
            res.json(attempt);
        });

        router.put(`/${this.RESOURCE}/:id`, async (req: Request<{id: string}>, res, next) => {
            const exercise = await this.service.update(
                req.params.id,
                req.body
            ).catch(next);
            res.json(exercise);
        });

        router.delete(`/${this.RESOURCE}/:id`, async (req, res, next) => {
            const deleted = await this.service.delete(req.params.id).catch(next);
            if(deleted) res.sendStatus(200);
            else res.sendStatus(409);
        });
    }
}