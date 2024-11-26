import express, {Request, Response, Application, NextFunction} from 'express';
import dotenv from 'dotenv';
import * as mongoose from "mongoose";
import ChatGroupResource from "./domain/chats/group/chat-group-resource";
import cors from 'cors'
import ExerciseResource from "./domain/exercises/exercise-resource";
import PromptGroupResource from "./domain/prompts/prompt-group-resource";
import ChatResource from "./domain/chats/chat-resource";
import * as path from "node:path";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || "80";
app.use(cors())
app.use(express.json())
connectDB().catch(err => console.log(err));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'webapp')));


app.listen(parseInt(port), '0.0.0.0', () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});

async function connectDB() {
    await mongoose.connect("" + process.env.DB_URL)
}

const router = express.Router();
const chatResource = new ChatResource(router);
const chatGroupResource = new ChatGroupResource(router);
const exerciseResource = new ExerciseResource(router);
const promptGroupResource = new PromptGroupResource(router);
app.use('/api', router);

// Serve the React app for all unknown routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'webapp', 'index.html'));
});

app.use(function errorHandler (err: Error, req: Request, res: Response, next: NextFunction) {
    res.status(500)
    res.render('error', { error: err })
})
