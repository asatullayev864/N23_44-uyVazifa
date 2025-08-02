import { connect } from "mongoose";
import config from '../config/index.js';

export async function connectDB() {
    try {
        await connect(config.MONGO_URI);
        console.info(`Database connected`);
    } catch (error) {
        console.error(`Error on connecting to database`, error);
        process.exit(1);
    }
}