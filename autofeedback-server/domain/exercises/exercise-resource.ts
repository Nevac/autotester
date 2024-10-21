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

        app.post(`/${this.RESOURCE}`, (req: Request<{}, {}, ExerciseUpdate>, res) => {
            this.service.create(
                req.body
            ).then(exercise =>
                res.json(exercise)
            );
        });

        app.put(`/${this.RESOURCE}/:id`, (req: Request<{id: string}, {}, ExerciseUpdate>, res) => {
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