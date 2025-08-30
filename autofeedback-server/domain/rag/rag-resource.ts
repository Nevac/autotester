import {Application, Router} from "express";
import { Request } from 'express';
import RagService from "./rag-service";
import RagUpdate from "./rag-update";
import {coerceBoolean} from "openai/core";
import ExerciseUpdate from "../exercises/exercise-update";
import * as wasi from "node:wasi";
import DocumentResponseHeaders from "../export/document-response-headers";

export default class RagResource {

    private readonly service: RagService
    private readonly RESOURCE: string = 'rag'

    constructor(
        private readonly router: Router,
    ) {
        this.service = new RagService();

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