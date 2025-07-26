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
                return res.status(422).json({
                    statusCode: 422,
                    message: error?.details[0]?.message ?? 'Error input validator' // Xato xabarini yuborish
                });
            }

            // 4. Agar hammasi to‘g‘ri bo‘lsa, keyingi middleware yoki controllerga o‘tkazish
            next();
        } catch (error) {
            // 5. Serverdagi boshqa xatoliklar uchun javob
            return res.status(500).json({
                statusCode: 500,
                message: error.message
            });
        }
    };
};