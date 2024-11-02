import {Application} from "express";
import { Request } from 'express';
import ExerciseService from "./exercise-service";
import ExerciseUpdate from "./exercise-update";
import {coerceBoolean} from "openai/core";

export default class ExerciseResource {

    private readonly service: ExerciseService
    private readonly RESOURCE: string = 'exercise'

    constructor(
        private readonly app: Application,
    ) {
        this.service = new ExerciseService();

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

        app.get(`/${this.RESOURCE}/:id`, async (req, res, next) => {
            const exercise = await this.service.getById(req.params.id).catch(next);
            res.json(exercise);
        });

        app.post(`/${this.RESOURCE}`, async (req, res, next) => {
            const exercise = await this.service.create(req.body).catch(next);
            res.json(exercise);
        });

        app.put(`/${this.RESOURCE}/:id`, async (req: Request<{id: string}>, res, next) => {
            const exercise = await this.service.update(
                req.params.id,
                req.body
            ).catch(next);
            res.json(exercise);
        });

        app.delete(`/${this.RESOURCE}/:id`, async (req, res, next) => {
            const deleted = await this.service.delete(req.params.id).catch(next);
            if(deleted) res.sendStatus(200);
            else res.sendStatus(409);
        });
    }
}