import config from '../config/index.js';      // Konfiguratsiya faylidan TOKEN kalitlarini olish
import token from '../utils/Token.js';        // Token bilan ishlovchi yordamchi funksiyalar

// AuthGuard - JWT token orqali foydalanuvchini autentifikatsiya qiluvchi middleware
export const AuthGuard = async (req, res, next) => {
    try {
        const auth = req.headers?.authorization; // Authorization headerni olish (masalan: "Bearer TOKEN")

        // 1. Token mavjudligini tekshirish
        if (!auth) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Error authorization error' // Token yo‘q bo‘lsa
            });
        }

        // 2. Bearer token formatini tekshirish
        const bearer = auth.split(' ')[0];     // "Bearer" so‘zi
        const authToken = auth.split(' ')[1];  // Tokenning o‘zi

        if (bearer !== 'Bearer' || !authToken) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Unauthorized' // Format noto‘g‘ri bo‘lsa
            });
        }

        // 3. Tokenni verify qilish
        const user = token.verifyToken(authToken, config.TOKEN.ACCESS_KEY); // Tokenni tekshirish

        // Agar token to‘g‘ri bo‘lsa, foydalanuvchi ma’lumotini requestga biriktiramiz
        req.user = user;

        // 4. Keyingi middleware yoki controllerga o‘tkazamiz
        next();
    } catch (error) {
        // Token noto‘g‘ri bo‘lsa yoki muddati tugagan bo‘lsa
        return res.status(500).json({
            statusCode: 500,
            message: error.message
        });
    }
}