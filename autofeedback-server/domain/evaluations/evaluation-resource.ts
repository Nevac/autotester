import {Application, Router} from "express";
import EvaluationService from "./evaluation-service";
import {coerceBoolean} from "openai/core";
import {Llm} from "../llms/llm";

export default class EvaluationResource {

    private readonly service: EvaluationService
    private readonly RESOURCE: string = 'evaluation'

    constructor(
        private readonly router: Router,
    ) {
        this.service = new EvaluationService();

        router.get(`/${this.RESOURCE}`, async (req, res, next) => {
            const populate = req.query.populate ? coerceBoolean(req.query.populate as string) : false;
            const evaluationGroupId = req.query.evaluationGroupId as string;
            const llm = req.query.llm as Llm;

            if(populate) {
                const list = await this.service.getAll().catch(next);
                res.json(list);
            }
            else {
                const list = await this.service.getAllListEntries(evaluationGroupId, llm).catch(next);
                res.json(list);
            }
        });

        router.get(`/${this.RESOURCE}/:id`, async (req, res, next) => {
            const exercise = await this.service.getById(req.params.id).catch(next);
            res.json(exercise);
        });

        router.post(`/${this.RESOURCE}/:id/confusion`, async (req, res, next) => {
            const exercise = await this.service.confusion(req.params.id, req.body).catch(next);
            res.json(exercise);
        });
    }
}