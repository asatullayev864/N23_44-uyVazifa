import { application } from './app.js';
import config from './config/index.js';
import express from 'express';

const app = express();
const PORT = config.PORT || 3000;

await application(app);

app.listen(PORT, () => console.info('Server running on port:', PORT));
