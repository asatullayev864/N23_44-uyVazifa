import Admin from '../models/admin.model.js';
import { BaseController } from './base.controller.js';
import crypto from '../utils/Crypto.js';
import validator from '../validation/adminValidation.js';
import config from '../config/index.js';
import token from '../utils/Token.js'; // ✅ token util import
import { AppError } from '../error/AppError.js';
import { successRes } from '../utils/success-res.js';

class AdminController extends BaseController {
    constructor() {
        super(Admin);
    }
    // Admin create qilish 
    async createAdmin(req, res, next) {
        try {
            const { name, email, password, role } = req.body;

            const existsName = await Admin.findOne({ name });
            if (existsName) {
                throw new AppError('Username already exists', 409);
            }

            const existsEmail = await Admin.findOne({ email });
            if (existsEmail) {
                throw new AppError('Email address already exists', 409);
            }

            const hashedPassword = await crypto.encrypt(password);
            const admin = await Admin.create({
                name,
                email,
                password: hashedPassword,
                role
            });

            return successRes(res, admin, 201);
        } catch (error) {
            next(error);
        }
    }

    // Tizimga kirish
    async signIn(req, res, next) {
        try {
            const { name, password } = req.body;
            const admin = await Admin.findOne({ name });
            if (!admin) {
                throw new AppError('Username or password incorrect', 400);
            }

            const isMatchPassword = await crypto.decrypt(password, admin.password ?? '');
            if (!isMatchPassword) {
                throw new AppError('Username or password incorrect', 400);
            }

            const payload = {
                id: admin._id,
                role: admin.role,
                isActive: admin.isActive
            };

            const accessToken = token.generateAccessToken(payload);
            const refreshToken = token.generateRefreshToken(payload);

            res.cookie('refreshTokenAdmin', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return successRes(res, {
                token: accessToken,
                admin
            });
        } catch (error) {
            next(error);
        }
    }

    // Yangi accessToken olish
    async generateNewToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
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

            const admin = await Admin.findById(verifiedToken?.id);
            if (!admin) {
                throw new AppError('Forbidden user', 403);
            }

            const payload = {
                id: admin._id,
                role: admin.role,
                isActive: admin.isActive
            };

            const accessToken = token.generateAccesToken(payload);

            return successRes(res, {
                token: accessToken
            });
        } catch (error) {
            next(error);
        }
    }

    // Tizimdan chiqish
    async signOut(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshTokenAdmin;
            if (!refreshToken) {
                throw new AppError('Refresh token not found', 401);
            }

            const verifiedToken = token.verifyToken(refreshToken, config.TOKEN.REFRESH_KEY);
            if (!verifiedToken) {
                throw new AppError('Refresh token expired or invalid', 401);
            }

            // Cookie’ni o‘chirish
            res.clearCookie('refreshTokenAdmin');

            return res.status(200).json({
                statusCode: 200,
                message: 'Successfully signed out'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminController();