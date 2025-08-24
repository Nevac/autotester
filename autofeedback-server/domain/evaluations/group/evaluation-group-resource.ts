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
            const evaluationGroup = await this.service.getById(req.params.id).catch(next);
            res.json(evaluationGroup);
        });

        router.post(`/${this.RESOURCE}`, async (req, res, next) => {
            const evaluationGroup = await this.service.create(req.body).catch(next);
            res.json(evaluationGroup);
        });

        router.post(`/${this.RESOURCE}/:id/retryFailed`, async (req, res, next) => {
            const evaluationGroup = await this.service.retryEvaluation(req.params.id).catch(next);
            res.json(evaluationGroup);
        });

        router.post(`/${this.RESOURCE}/:id/calculateScore`, async (req, res, next) => {
            const evaluationGroup = await this.service.calculateScoreAllEvaluations(req.params.id).catch(next);
            res.json(evaluationGroup);
        });

        router.post(`/${this.RESOURCE}/:id/correctScore`, async (req, res, next) => {
            const evaluation = await this.service.correctScore(
                req.params.id,
                req.body.evaluationId,
                req.body.correction
            ).catch(next);
            res.json(evaluation);
        });

        router.delete(`/${this.RESOURCE}/:id`, async (req, res, next) => {
            const deleted = await this.service.delete(req.params.id).catch(next);
            if(deleted) res.sendStatus(200);
            else res.sendStatus(409);
        });
    }
}