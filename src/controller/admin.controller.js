import Admin from '../models/admin.model.js';
import { BaseController } from './base.controller.js';
import crypto from '../utils/Crypto.js';
import config from '../config/index.js';
import token from '../utils/Token.js'; // ✅ token util import
import { AppError } from '../error/AppError.js';
import { successRes } from '../utils/success-res.js';
import { generateOTP } from '../utils/generate-otp.js';
import { sendOTPtoMail } from '../utils/send-mail.js';
import redis from '../utils/Redis.js';

class AdminController extends BaseController {
    constructor() {
        super(Admin);
    }
    // Admin create qilish 
    async createAdmin(req, res, next) {
        try {
            const { name, email, password } = req.body;

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
                hashedPassword: hashedPassword
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

            const isMatchPassword = await crypto.decrypt(password, admin.hashedPassword ?? '');
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
            console.log(error);

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

    async updateAdmin(req, res, next) {
        try {
            const { id } = req.params.id;
            const admin = await BaseController.checkById(id);
            const { name, email, password } = req.body;
            if (name) {
                const exists = await Admin.findOne({ name });
                if (exists && exists.name !== name) {
                    throw new AppError('Username already exists', 409);
                }
            }

            if (email) {
                const exists = await Admin.findOne({ email });
                if (exists && exists.email !== email) {
                    throw new AppError('Email addres already exists', 409);
                }
            }
            let hashedPassword = admin.hashedPassword;
            if (password) {
                if (req.user?.role != admin.role) {
                    throw new AppError('Not eccess to change password for admin', 403);
                }
                hashedPassword = await crypto.encrypt(password);
            }
            const updateAdmin = await Admin.findByIdAndUpdate(id, {
                ...req.body, hashedPassword
            }, { new: true });
            return successRes(res, updateAdmin);
        } catch (error) {
            next(error);
        }
    }

    async updatePasswordForAdmin(req, res, next) {
        try {
            const { id } = req.params.id;
            const admin = await BaseController.checkById(Admin, id);
            const { oldPassword, newPassword } = req.body;
            const isMatchPassword = await crypto.decrypt(oldPassword, admin.hashedPassword);
            if (!isMatchPassword) {
                throw new AppError('Incorrect old password', 400);
            }
            const hashedPassword = await crypto.encrypt(newPassword);
            const updateAdmin = await Admin.findByIdAndUpdate(id, { hashedPassword }, { new: true });
            return successRes(res, this.updateAdmin);
        } catch (error) {
            next(error);
        }
    }

    // Parolni unutgan bolsa 6 talik parol yuborish
    async forgetPassword(req, res, next) {
        try {
            const { email } = req.body;
            const admin = await Admin.findOne({ email });
            console.log(admin);
            if (!admin) {
                throw new AppError('Email address id not found', 404);
            }
            const otp = generateOTP();
            sendOTPtoMail(email, otp);
            await redis.setData(email, otp);
            console.log('OTP:', otp);
            return successRes(res, {
                email: email,
                OTP: otp,
                expireOTP: '5 minutes'
            });
        } catch (error) {
            next(error);
        }
    }

    // Yoborilgan 6 talik parolni tekshirish va yangi password yaratishga otib yuborish
    async confirmOTP(req, res, next) {
        try {
            const { email, otp } = req.body;
            const checkOTP = await redis.getData(email);
            if (checkOTP !== otp) {
                throw new AppError('OTP incurrect or expired', 400);
            }
            await redis.deleteData(email);
            return successRes(res, {
                confirmPasswordURL: config.CONFIRM_PASSWORD_URL,
                requesMethod: 'PATCH',
                email
            });
        } catch (error) {
            next(error);
        }
    }

    // Paroni tastiqlagandan kyn foydalanuvchi yangi password yaratish
    async confirmPassword(req, res, next) {
        try {
            const { email, newPassword } = req.body;
            const admin = await Admin.findOne({ email });
            if (!email) {
                throw new AppError('Email address not found', 404);
            }
            const hashedPassword = await crypto.encrypt(newPassword);
            const updateAdmin = await Admin.findByIdAndUpdate(admin._id, { hashedPassword }, { new: true });
            return successRes(res, updateAdmin);
        } catch (error) {

        }
    }
}

export default new AdminController();