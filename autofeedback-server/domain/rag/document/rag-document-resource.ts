import {Router} from "express";
import RagDocumentService from "./rag-document-service";
import {coerceBoolean} from "openai/core";
import DocumentResponseHeaders from "../../export/document-response-headers";

export default class RagDocumentResource {

    private readonly service: RagDocumentService
    private readonly RESOURCE: string = 'rag-document'

    constructor(
        private readonly router: Router,
    ) {
        this.service = new RagDocumentService();

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

        router.put(`/${this.RESOURCE}/export`, async (req, res, next) => {
            const pdf = await this.service.export(req.body.ids).catch(next);
            if(pdf) {
                DocumentResponseHeaders.pdf(
                    "aufgaben",
                    pdf.length,
                    res
                );
                res.end(pdf);
            }
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