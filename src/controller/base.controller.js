import { isValidObjectId } from "mongoose";
import { AppError } from "../error/AppError.js";
import { successRes } from "../utils/success-res.js";

// Barcha umumiy (base) CRUD amallarini bajaruvchi controller klassi
export class BaseController {
    constructor(model) {
        this.model = model; // Controllerga model (mongoose model) kiritiladi
    }

    // CREATE - yangi hujjat (document) yaratish
    create = async (req, res, next) => {
        try {
            const data = await this.model.create(req.body); // Yangi hujjat yaratish
            return successRes(res, data, 201);
        } catch (error) {
            console.log(error); // Serverdagi xatolikni logga yozish
            next(error);
        }
    };

    // READ - barcha hujjatlarni olish
    findAll = async (req, res, next) => {
        try {
            const data = await this.model.find(); // Barcha hujjatlarni topish
            return successRes(res, data);
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    };

    // READ - bitta hujjatni ID orqali topish
    findById = async (req, res, next) => {
        try {
            const id = req.params?.id;

            // ObjectId to'g'riligi tekshirilmoqda
            this.checkById(id);
            const data = await this.model.findById(id); // ID bo‘yicha topish

            if (!data) {
                throw new AppError('Not found', 404);
            }

            return successRes(res, data);
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    };

    // UPDATE - mavjud hujjatni yangilash
    update = async (req, res, next) => {
        try {
            const id = req.params?.id;
            this.checkById(id);
            const data = await this.model.findByIdAndUpdate(id, req.body, {
                new: true, // Yangi (yangilangan) hujjat qaytarilsin
                runValidators: true // Validatorlar ishlasin
            });

            if (!data) {
                throw new AppError('Not found', 404);
            }

            return successRes(res, data);
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    };

    // DELETE - hujjatni o‘chirish
    delete = async (req, res, next) => {
        try {
            const id = req.params?.id;
            await this.checkById(id);
            const data = await this.model.findByIdAndDelete(id);

            if (!data) {
                throw new AppError('Not found', 404)
            }

            return successRes(res, {}); // Bo‘sh obyekt qaytariladi
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    };

    static async checkById( schema,id) {
        if (!isValidObjectId(id)) {
            throw new AppError('Invalid ObjectId', 400);
        }
        const data = await schema.findById(id);
        if (!data) {
            throw new AppError('Not found', 404)
        }
    }
}