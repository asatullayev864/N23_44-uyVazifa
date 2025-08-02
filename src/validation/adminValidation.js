import Joi from 'joi';

class AdminValidator {
    static passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]{8,}$/;;

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

    signin() {
        return Joi.object({
            name: Joi.string().min(2).required().messages({
                'string.empty': `"name" bo'sh bo'lishi mumkin emas`,
                'string.base': "Ism satr bo'lishi kerak",
                'any.required': "Ism kiritilishi shart"
            }),
            password: Joi.string().required().messages({
                'string.base': "Parol satr bo'lishi kerak",
                'any.required': "Parol kiritilishi shart"
            }),
        })
    }

    update() {
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

    password() {
        return Joi.object({
            oldPassword: Joi.string().pattern(AdminValidator.passwordRegex).required().messages({
                'string.pattern.base': "Parol kamida 8 ta belgidan iborat bo'lib, unda kichik harf, katta harf, raqam va maxsus belgi bo'lishi kerak",
            }),
            newPassword: Joi.string().pattern(AdminValidator.passwordRegex).required(),
        });
    }

    forgetPassword() {
        return Joi.object({
            email: Joi.string().email().required(),
        });
    }

    confirmOTP() {
        return Joi.object({
            email: Joi.string().email().optional().messages({
                'string.email': "Email noto'g'ri formatda kiritilgan",
            }),
            otp: Joi.string().length(6).required()
        });
    }

    confirmPassword() {
        return Joi.object({
            email: Joi.string().email().optional().messages({
                'string.email': "Email noto'g'ri formatda kiritilgan",
            }),
            newPassword: Joi.string().pattern(AdminValidator.passwordRegex).required()
        });
    }
}

export default new AdminValidator();
