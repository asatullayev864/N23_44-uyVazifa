import winston from "winston";
// import 'winston-mongodb';
// import config from "../../config/index.js";

const customTime = winston.format((info) => {
    const date = new Date();
    info.timestamp = (date.toLocaleString('en-GB', { timeZone: 'Asia/Tashkent', hour12: false }));
    return info
});

const logger = winston.createLogger({
    transports: [
        // Faylga log yozish
        new winston.transports.File({ filename: 'log/error.log', level: 'error' })

        // MongoDB ga log yozish [ hozircha o‘chirib qo‘yilgan ]
        // new winston.transports.MongoDB({
        //     db: config.MONGO_URI,
        //     collection: 'error-log',
        //     level: 'error'
        // })
    ],
    format: winston.format.combine(
        customTime(),
        winston.format.prettyPrint()
    )
});

export default logger;