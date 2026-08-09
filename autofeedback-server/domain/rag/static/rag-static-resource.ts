import {Router} from "express";
import {coerceBoolean} from "openai/core";
import RagStaticService from "./rag-static-service";
import RagStaticDto from "./rag-static-dto";

export default class RagStaticResource {

    private readonly service: RagStaticService
    private readonly RESOURCE: string = 'rag-static'

    constructor(
        private readonly router: Router,
    ) {
        this.service = new RagStaticService();

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
            const ragStatic = await this.service.getById(req.params.id).catch(next);
            if(ragStatic) {
                res.json(RagStaticDto.fromModel(ragStatic));
            }
        });

        router.post(`/${this.RESOURCE}`, async (req, res, next) => {
            const ragStatic = await this.service.create(req.body).catch(next);
            res.json(ragStatic);
        });

        router.put(`/${this.RESOURCE}/:id`, async (req, res, next) => {
            const ragStatic = await this.service.update(
                req.params.id,
                req.body
            ).catch(next);
            res.json(ragStatic);
        });

        router.delete(`/${this.RESOURCE}/:id`, async (req, res, next) => {
            const deleted = await this.service.delete(req.params.id).catch(next);
            if(deleted) res.sendStatus(200);
            else res.sendStatus(409);
        });
    }
}