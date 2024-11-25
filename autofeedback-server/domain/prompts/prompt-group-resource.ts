import {Application, Router} from "express";
import { Request } from 'express';
import PromptGroupService from "./prompt-group-service";
import PromptGroupUpdate from "./prompt-group-update";
import {coerceBoolean} from "openai/core";
import ExerciseUpdate from "../exercises/exercise-update";
import * as wasi from "node:wasi";

export default class PromptGroupResource {

    private readonly service: PromptGroupService
    private readonly RESOURCE: string = 'prompt-group'

    constructor(
        private readonly router: Router,
    ) {
        this.service = new PromptGroupService();

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
            const exercise = await this.service.getById(req.params.id).catch(next);
            res.json(exercise);
        });

        router.post(`/${this.RESOURCE}`, async (req, res, next) => {
            const exercise = await this.service.create(req.body).catch(next);
            res.json(exercise);
        });

        router.put(`/${this.RESOURCE}/:id`, async (req, res, next) => {
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