import {Application} from "express";
import ChatGroupCreateDto from "./chat-group-create-dto";
import { Request } from 'express';
import ChatGroupService from "./chat-group-service";

export default class ChatGroupResource {

    private readonly service: ChatGroupService
    private readonly RESOURCE: string = 'chat-group'

    constructor(
        private readonly app: Application,
    ) {
        this.service = new ChatGroupService();

        app.get('/chat-group', (req, res) => {
            this.service.getAll().then(
                list => {
                    res.json(list)
                }
            );
        })

        app.post('/chat-group', (req: Request<{}, {}, ChatGroupCreateDto>, res) => {
            const dto: ChatGroupCreateDto = req.body
            console.log(req.body)
            this.service.create(
                {
                    name: "test",
                    promptGroup: {
                        name: "test",
                        prompts: dto.prompts
                    },
                    exercise: {
                        name: "test",
                        task: dto.task,
                        solution: dto.solution
                    },
                    attempt: dto.attempt
                }
            )

            res.sendStatus(200);
        })
    }
}