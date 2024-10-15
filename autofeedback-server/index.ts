import express, { Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import * as mongoose from "mongoose";

//For env File
dotenv.config();

const index: Application = express();
const port = process.env.PORT || 8000;
connectDB().catch(err => console.log(err));

index.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

index.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});

async function connectDB() {
    await mongoose.connect("" + process.env.DB_URL)
}