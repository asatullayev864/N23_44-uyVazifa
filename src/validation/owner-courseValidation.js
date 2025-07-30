import Joi from 'joi';

class OwnerValidator {
    static passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]{8,}$/;

    create() {
        return Joi.object({
            email: Joi.string().email().required().messages({
                'string.email': "Email noto'g'ri formatda kiritilgan",
                'any.required': "Email kiritilishi shart"
            }),

            userName: Joi.string().min(3).max(30).required().messages({
                'string.min': "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak",
                'string.max': "Foydalanuvchi nomi 30 ta belgidan oshmasligi kerak",
                'any.required': "Foydalanuvchi nomi kiritilishi shart"
            }),

            fullName: Joi.string().min(3).max(100).required().messages({
                'string.min': "To'liq ism kamida 3 ta belgidan iborat bo'lishi kerak",
                'string.max': "To'liq ism 100 ta belgidan oshmasligi kerak",
                'any.required': "To'liq ism kiritilishi shart"
            }),

            hashedPassword: Joi.string().pattern(OwnerValidator.passwordRegex).required().messages({
                'string.pattern.base': "Parol kamida 8 ta belgidan iborat bo'lib, unda kichik harf, katta harf, raqam va maxsus belgi bo'lishi kerak",
                'any.required': "Parol kiritilishi shart"
            }),

            wallet: Joi.number().min(0).optional().messages({
                'number.base': "Hamyon qiymati raqam bo'lishi kerak",
                'number.min': "Hamyon qiymati manfiy bo'lishi mumkin emas"
            }),

            experience: Joi.string()
                .valid('Beginner', 'Intermediate', 'Advanced', 'Expert')
                .optional()
                .messages({
                    'any.only': "Tajriba qiymati faqat quyidagilardan biri bo'lishi mumkin: Beginner, Intermediate, Advanced, Expert"
                }),

            isActive: Joi.boolean().optional()
        });
    }

    update() {
        return Joi.object({
            email: Joi.string().email().optional().messages({
                'string.email': "Email noto'g'ri formatda kiritilgan"
            }),

            userName: Joi.string().min(3).max(30).optional().messages({
                'string.min': "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak",
                'string.max': "Foydalanuvchi nomi 30 ta belgidan oshmasligi kerak"
            }),

            fullName: Joi.string().min(3).max(100).optional().messages({
                'string.min': "To'liq ism kamida 3 ta belgidan iborat bo'lishi kerak",
                'string.max': "To'liq ism 100 ta belgidan oshmasligi kerak"
            }),

            hashedPassword: Joi.string().pattern(OwnerValidator.passwordRegex).optional().messages({
                'string.pattern.base': "Parol kamida 8 ta belgidan iborat bo'lib, unda kichik harf, katta harf, raqam va maxsus belgi bo'lishi kerak"
            }),

            wallet: Joi.number().min(0).optional().messages({
                'number.base': "Hamyon qiymati raqam bo'lishi kerak",
                'number.min': "Hamyon qiymati manfiy bo'lishi mumkin emas"
            }),

            experience: Joi.string()
                .valid('Beginner', 'Intermediate', 'Advanced', 'Expert')
                .optional()
                .messages({
                    'any.only': "Tajriba qiymati faqat quyidagilardan biri bo'lishi mumkin: Beginner, Intermediate, Advanced, Expert"
                }),

            isActive: Joi.boolean().optional()
        });
    }
}

export default new OwnerValidator();
