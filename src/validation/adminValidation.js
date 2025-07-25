import Joi from 'joi';

class AdminValidator {
    constructor() {
        this.passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    }

    create(data) {
        const admin = Joi.object({
            name: Joi.string().required().messages({
                'string.base': "Ism satr bolishi kerak",
                'any.required': "Ism kiritilishi shart",
            }),
            email: Joi.string().email().required().messages({
                'string.email': "Email noto'g'ri formatda kiritilgan",
                'any.required': "Email kiritilishi shart",
            }),
            password: Joi.string().pattern(this.passRegex).required().messages({
                'string.pattern.base': "Parol kamida 8 ta belgidan iborat bo'lib, unda kichik harf, katta harf, raqam va maxsus belgi bo'lishi kerak",
                'any.required': "Parol kiritilishi shart",
            }),
        });

        return admin.validate(data);
    }

    signin(data) {
        const admin = Joi.object({
            name: Joi.string().optional().messages({
                'string.base': "Ism satr bo'lishi kerak",
            }),
            password: Joi.string().optional().messages({
                'string.base': "Parol satr bo'lishi kerak",
            }),
        });

        return admin.validate(data);
    }

    update(data) {
        const admin = Joi.object({
            name: Joi.string().optional().messages({
                'string.base': "Ism satr bo'lishi kerak",
            }),
            email: Joi.string().email().optional().messages({
                'string.email': "Email noto'g'ri formatda kiritilgan",
            }),
            password: Joi.string().pattern(this.passRegex).optional().messages({
                'string.pattern.base': "Parol kamida 8 ta belgidan iborat bo'lib, unda kichik harf, katta harf, raqam va maxsus belgi bo'lishi kerak",
            }),
        });

        return admin.validate(data);
    }
}

export default new AdminValidator();
