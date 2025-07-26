import Joi from 'joi';

class AdminValidator {
    static passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    create(data) {
        return Joi.object({
            name: Joi.string().required().messages({
                'string.base': "Ism satr bolishi kerak",
                'any.required': "Ism kiritilishi shart",
            }),
            email: Joi.string().email().required().messages({
                'string.email': "Email noto'g'ri formatda kiritilgan",
                'any.required': "Email kiritilishi shart",
            }),
            password: Joi.string().pattern(AdminValidator.passwordRegex).required().messages({
                'string.pattern.base': "Parol kamida 8 ta belgidan iborat bo'lib, unda kichik harf, katta harf, raqam va maxsus belgi bo'lishi kerak",
                'any.required': "Parol kiritilishi shart",
            }),
        });
    }

    signin(data) {
        return Joi.object({
            name: Joi.string().required().messages({
                'string.base': "Ism satr bo'lishi kerak",
                'any.required': "Ism kiritilishi shart"
            }),
            password: Joi.string().required().messages({
                'string.base': "Parol satr bo'lishi kerak",
                'any.required': "Parol kiritilishi shart"
            }),
        }).validate(data);
    }

    update(data) {
        return Joi.object({
            name: Joi.string().optional().messages({
                'string.base': "Ism satr bo'lishi kerak",
            }),
            email: Joi.string().email().optional().messages({
                'string.email': "Email noto'g'ri formatda kiritilgan",
            }),
            password: Joi.string().pattern(AdminValidator.passwordRegex).optional().messages({
                'string.pattern.base': "Parol kamida 8 ta belgidan iborat bo'lib, unda kichik harf, katta harf, raqam va maxsus belgi bo'lishi kerak",
            }),
        });
    }
}

export default new AdminValidator();
