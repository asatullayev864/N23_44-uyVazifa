import { config } from "dotenv";
config();

export default {
    PORT: Number(process.env.PORT),
    MONGO_URI: String(process.env.MONGO_URI)
}