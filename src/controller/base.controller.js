import { isValidObjectId } from "mongoose";

// Barcha umumiy (base) CRUD amallarini bajaruvchi controller klassi
export class BaseController {
    constructor(model) {
        this.model = model; // Controllerga model (mongoose model) kiritiladi
    }

    // CREATE - yangi hujjat (document) yaratish
    create = async (req, res) => {
        try {
            const data = await this.model.create(req.body); // Yangi hujjat yaratish
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data
            });
        } catch (error) {
            console.log(error); // Serverdagi xatolikni logga yozish
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    };

    // READ - barcha hujjatlarni olish
    findAll = async (req, res) => {
        try {
            const data = await this.model.find(); // Barcha hujjatlarni topish
            return res.status(200).json({
                statusCode: 200,
                message: 'succes',
                data
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message
            });
        }
    };

    // READ - bitta hujjatni ID orqali topish
    findById = async (req, res) => {
        try {
            const id = req.params?.id;

            // ObjectId to'g'riligi tekshirilmoqda
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Invalid ObjektId'
                });
            }

            const data = await this.model.findById(id); // ID bo‘yicha topish

            if (!data) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'not found'
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: 'succes',
                data
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message
            });
        }
    };

    // UPDATE - mavjud hujjatni yangilash
    update = async (req, res) => {
        try {
            const id = req.params?.id;

            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 404, // E’tibor bering: bu yerda statusCode `400` bo‘lishi kerak, lekin `404` yozilgan
                    message: 'Invalid objectId'
                });
            }

            const data = await this.model.findByIdAndUpdate(id, req.body, {
                new: true, // Yangi (yangilangan) hujjat qaytarilsin
                runValidators: true // Validatorlar ishlasin
            });

            if (!data) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'not found by id'
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message
            });
        }
    };

    // DELETE - hujjatni o‘chirish
    delete = async (req, res) => {
        try {
            const id = req.params?.id;

            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 404, // Bu yer ham: `400` status bo‘lishi kerak
                    message: 'Invalid objectId'
                });
            }

            // ⚠️ XATO: bu yerda findByIdAndDelete bo‘lishi kerak edi
            const data = await this.model.findByIdAndDelete(id);

            if (!data) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'not found by id'
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {} // Bo‘sh obyekt qaytariladi
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || "Internal server error",
            });
        }
    };
}