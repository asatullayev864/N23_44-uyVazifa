import { config } from "dotenv";
config();

export default {
    PORT: Number(process.env.PORT),
    MONGO_URI: String(process.env.MONGO_URI),
    SUPERADMIN_NAME: String(process.env.SUPERADMIN_NAME),
    SUPERADMIN_PASSWORD: String(process.env.SUPERADMIN_PASSWORD),
    SUPERADMIN_EMAIL: String(process.env.SUPERADMIN_EMAIL)
}