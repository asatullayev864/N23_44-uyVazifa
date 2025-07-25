import Admin from '../models/admin.model.js';
import { BaseController } from './base.controller.js';
import crypto from '../utils/Crypto.js';
import validator from '../validation/adminValidation.js';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

class AdminController extends BaseController {
    constructor() {
        super(Admin);
    }

    async createAdmin(req, res) {
        try {
            const { error, value } = validator.create(req.body);
            if (error) {
                return res.status(422).json({
                    statusCode: 422,
                    message: error?.details[0]?.message ?? 'Error input validation'
                });
            }
            const { name, email, password, role } = req.body;

            const existsName = await Admin.findOne({ name });
            if (existsName) {
                return res.status(409).json({
                    statusCode: 409,
                    message: 'Username already exists'
                });
            }

            const existsEmail = await Admin.findOne({ email });
            if (existsEmail) {
                return res.status(409).json({
                    statusCode: 409,
                    message: 'Email addres already exists'
                });
            }

            const hashedPassword = await crypto.encrypt(password);
            const admin = await Admin.create({
                name,
                email,
                password: hashedPassword,
                role
            });
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: admin
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    // Data bazada bor ma'lumotlarni korish [ signIn ]
    async signIn(req, res) {
        try {
            const { error } = validator.signin(req.body);
            if (error) {
                return res.status(422).json({
                    statusCode: 422,
                    message: error?.details[0]?.message ?? 'Error input validation'
                });
            }
            const { name, password } = req.body;
            const admin = await Admin.findOne({ name });
            if (!admin) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Username or password incorrect'
                });
            }

            const isMatchPassword = await crypto.decrypt(password, admin.password ?? '');
            if (!isMatchPassword) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Username or password incorrect'
                })
            }

            const payload = {
                id: admin._id, role: admin.role, isActive: admin.isActive
            };
            const accestoken = jwt.sign(payload, 'judayamYashirinKalit', {
                expiresIn: '24h'
            });

            const refreshToken = jwt.sign(payload, 'judayamYashirinKalit2', {
                expiresIn: '30h'
            });

            res.cookie('refreshTokenAdmin', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            })
            res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {
                    token: accestoken,
                    admin
                }
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async generateNewToken(req, res) {
        try {
            const refreshToken = req.cookie?.refreshTokenAdmin;
            if (!refreshToken) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Refresh token not found'
                });
            }

            const verifiedToken = token.verifyToken(refreshToken, config.TOKEN.REFRESH_KEY);
            if (!verifiedToken) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Refresh token expire'
                });
            }

            const admin = await Admin.findById(verifiedToken?.id);
            if (!admin) {
                return res.status(403).json({
                    statusCode: 403,
                    message: 'Forbidden user'
                });
            }

            const payload = {
                id: admin._id, role: admin.role, isActive: admin.isActive
            }

            const accessToken = token.generateAccessToken(payload);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {
                    token: accessToken
                }
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async signOut(req, res) {
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
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Refresh token expire'
                });
            }

            const admin = await Admin.findById(verifiedToken?.id);
            if (!admin) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Forbidden user'
                });
            }

            const payload = {
                id: admin._id, role: admin.role, isActive: admin.isActive
            }

            const accessToken = token.generateAccessToken(payload);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {
                    token: accessToken
                }
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message
            })
        }
    }
}

export default new AdminController();