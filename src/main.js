import express from 'express';
import config from './config/index.js';
import { connectDB } from './db/index.js';
import indexRouter from './routes/index.route.js';

const app = express();
const PORT = config.PORT || 3000;

app.use(express.json());

await connectDB();

app.use('/api', indexRouter);

app.listen(PORT, () => console.log(`Server running on port:`, PORT));