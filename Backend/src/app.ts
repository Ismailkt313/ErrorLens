import express,{ Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mainRoute from './routes/main.route';
dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(mainRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});  