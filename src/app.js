import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import cookieParser from 'cookie-parser';
import expressWinston from 'express-winston';

import logger from './helpers/log/logger.js';
import indexRouter from './routes/index.route.js';
import { globalErrorHandle } from './error/global-error.handle.js';
import { connectDB } from './db/index.js';

export async function application(app) {
    try {
        // Cross-Origin Resource Sharing (CORS) ni yoqadi — bu front-end (masalan, React) va back-end boshqa domenlarda ishlaganda kerak bo‘ladi
        app.use(cors({
            origin: '*' // Hamma domenlarga ruxsat berilyapti (zarurat bo‘lsa, bu yerda aniq domen ko‘rsatilgan bo‘lishi mumkin)
        }));

        // Xavfsizlik uchun ba'zi HTTP headerlarni qo‘shadi (helmet XSS, clickjacking kabi hujumlardan himoya qiladi)
        app.use(helmet());

        // Kiruvchi JSON formatdagi so‘rovlarni `req.body` ga aylantiradi
        app.use(express.json());

        // Cookie fayllarni o‘qish imkonini beradi (req.cookies orqali foydalanish uchun)
        app.use(cookieParser());

        app.use(expressWinston.logger({
            winstonInstance: logger,
            msg: `HTTP {{req.url}} {{req.method}}`,
            meta: true
        }))

        // MongoDB (yoki boshqa bazaga) ulanishni amalga oshiradi
        await connectDB();

        // API marshrutlarini /api ostida ishlatadi (masalan, /api/users, /api/students va hokazo)
        app.use('/api', indexRouter);

        process.on('unhandledRejection', (reason, p) => {
            console.log(30000, reason);
        });

        process.on('uncaughtException', (err) => {
            console.error(err);
        });



        app.use(expressWinston.errorLogger({
            winstonInstance: logger
        }));

        // Global xatoliklarni tutuvchi middleware — bu oxirgi bo‘lib yozilishi kerak
        app.use(globalErrorHandle);
    } catch (error) {
        console.log(error);
    }
}