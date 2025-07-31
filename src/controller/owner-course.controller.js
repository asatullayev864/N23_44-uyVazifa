import OwnerCourse from "../models/owner-course.model.js";
import { BaseController } from "./base.controller.js";

class OwnerCourseController extends BaseController {
    constructor() {
        super(OwnerCourse);
    }

    async createOwnerCourse(req, res, next) {
        try {
            const { email, userName, fullName, isActive, password, wallet, expirience } = req.body;

            const existsName = await OwnerCourse.findOne({ userName });
            if (existsName) {
                throw new AppError('Username already exists', 409);
            }

            const existsEmail = await OwnerCourse.findOne({ email });
            if (existsEmail) {
                throw new AppError('Email address already exists', 409);
            }

            const hashedPassword = await crypto.encrypt(password);
            delete req.body.password;
            const ownerCourse = await OwnerCourse.create({
                ...req.body,
                hashedPassword
            });

            return successRes(res, ownerCourse, 201);
        } catch (error) {
            next(error);
        }
    }
}

export default new OwnerCourseController();