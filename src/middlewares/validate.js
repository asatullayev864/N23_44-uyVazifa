import { AppError } from "../error/AppError.js";

// validate - middleware funksiyasi. U validatsiya sxemasi asosida req.body ma’lumotlarini tekshiradi.
export const validate = (schemaValid) => {
    return function (req, res, next) {
        try {
            // 1. Validatsiya sxemasini olish (schemaValid — bu funksiyaga aylantirilgan Joi schema)
            const schema = schemaValid();

            // 2. req.body ustida validatsiya o‘tkazish
            const { error } = schema.validate(req.body);

            // 3. Agar xatolik bo‘lsa, 422 (Unprocessable Entity) status bilan javob qaytarish
            if (error) {
                // Xato xabarini yuborish
                throw new AppError(error?.details[0]?.message ?? 'Error input validator', 422);
            }

            // 4. Agar hammasi to‘g‘ri bo‘lsa, keyingi middleware yoki controllerga o‘tkazish
            next();
        } catch (error) {
            console.log(error);
            
            // 5. Serverdagi boshqa xatoliklar uchun javob
            next(error);
        }
    };
};