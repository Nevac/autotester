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
const port = process.env.PORT || 8000;
app.use(cors())
app.use(express.json())
connectDB().catch(err => console.log(err));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'webapp')));

// Serve the React app for all unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'webapp', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});

async function connectDB() {
    await mongoose.connect("" + process.env.DB_URL)
}

const chatResource = new ChatResource(app);
const chatGroupResource = new ChatGroupResource(app);
const exerciseResource = new ExerciseResource(app);
const promptGroupResource = new PromptGroupResource(app);

app.use(function errorHandler (err: Error, req: Request, res: Response, next: NextFunction) {
    res.status(500)
    res.render('error', { error: err })
})
