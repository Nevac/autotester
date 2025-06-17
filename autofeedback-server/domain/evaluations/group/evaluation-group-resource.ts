import {Router} from "express";
import EvaluationGroupService from "./evaluation-group-service";
import {coerceBoolean} from "openai/core";

export default class EvaluationGroupResource {

    private readonly service: EvaluationGroupService;
    private readonly RESOURCE: string = 'evaluation-group';

    constructor(
        private readonly router: Router,
    ) {
        this.service = new EvaluationGroupService();

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
            const chatGroup = await this.service.create(req.body).catch(next);
            res.json(chatGroup);
        });

        router.delete(`/${this.RESOURCE}/:id`, async (req, res, next) => {
            const deleted = await this.service.delete(req.params.id).catch(next);
            if(deleted) res.sendStatus(200);
            else res.sendStatus(409);
        });
    }
}