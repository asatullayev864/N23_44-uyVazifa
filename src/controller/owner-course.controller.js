import OwnerCourse from "../models/owner-course.model.js";
import { BaseController } from "./base.controller.js";
import crypto from "../utils/Crypto.js";
import { successRes } from "../utils/success-res.js";
import { AppError } from "../error/AppError.js";
import config from '../config/index.js';
import token from '../utils/Token.js';

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

    async signin(req, res, next) {
        try {
            const { email, password } = req.body;
            const owner = await OwnerCourse.findOne({ email });
            const isMatchPassword = await crypto.decrypt(password, owner?.hashedPassword);
            if (!isMatchPassword) {
                throw new AppError('Owner course email or password incorrect', 400);
            }
            const payload = {
                id: owner._id,
                role: owner.role,
                isActive: owner.isActive
            };

            const accessToken = token.generateAccessToken(payload);
            const refreshToken = token.generateRefreshToken(payload);

            res.cookie('refreshTokenOwnerCOurse', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return successRes(res, {
                token: accessToken,
                owner
            });
        } catch (error) {
            next(error);
        }
    }

    async generateNewToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenOwnerCourse;
            if (!refreshToken) {

                return res.status(401).json({
                    statusCode: 401,
                    message: 'Refresh token not found'
                });
            }

            const verifiedToken = token.verifyToken(refreshToken, config.TOKEN.REFRESH_KEY);
            if (!verifiedToken) {
                throw new AppError('Refresh token expired or invalid', 401);
            }

            const owner = await OwnerCourse.findById(verifiedToken?.id);
            if (!owner) {
                throw new AppError('Forbidden user', 403);
            }

            const payload = {
                id: owner._id,
                role: owner.role,
                isActive: owner.isActive
            };

            const accessToken = token.generateAccesToken(payload);

            return successRes(res, {
                token: accessToken
            });
        } catch (error) {
            next(error);
        }
    }

    async signOut(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenOwnerCourse;
            if (!refreshToken) {
                throw new AppError('Refresh token not found', 401);
            }

            const verifiedToken = token.verifyToken(refreshToken, config.TOKEN.REFRESH_KEY);
            if (!verifiedToken) {
                throw new AppError('Refresh token expired or invalid', 401);
            }

            const owner = await OwnerCourse.findById(verifiedToken?.id);
            if (!owner) {
                throw new AppError('Forbidden user', 403);
            }

            res.clearCookie('refreshTokenAdmin');
            return successRes(res, {});
        } catch (error) {
            next(error);
        }
    }
}

export default new OwnerCourseController();