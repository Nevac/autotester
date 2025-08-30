import {Application, Router} from "express";
import ExportService from "./export-service";

export default class EvaluationResource {

    private readonly service: ExportService
    private readonly RESOURCE: string = 'export'

    constructor(
        private readonly router: Router,
    ) {
        this.service = new ExportService();

        router.post(`/${this.RESOURCE}/attempts/:id`, async (req, res, next) => {
            const pdf = await this.service.exportAttempts(req.body.ids).catch(next);

            if(pdf) {
                res.set({
                    "Content-Type": "application/pdf",
                    "Content-Disposition": "attachment; filename=document.pdf",
                    "Content-Length": pdf.length
                });

                res.send(pdf);
            }
        });
    }
}