import express, { Request, Response , Application } from 'express';
import dotenv from 'dotenv';

//For env File
dotenv.config();

const index: Application = express();
const port = process.env.PORT || 8000;

index.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

index.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});
