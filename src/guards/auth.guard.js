import config from '../config/index.js';      // Konfiguratsiya faylidan TOKEN kalitlarini olish
import { AppError } from '../error/AppError.js';
import token from '../utils/Token.js';        // Token bilan ishlovchi yordamchi funksiyalar

// AuthGuard - JWT token orqali foydalanuvchini autentifikatsiya qiluvchi middleware
export const AuthGuard = async (req, res, next) => {
    try {
        const auth = req.headers?.authorization; // Authorization headerni olish (masalan: "Bearer TOKEN")

        // 1. Token mavjudligini tekshirish
        if (!auth) {
            throw new AppError('Error authorization error', 401);  // Token yo‘q bo‘lsa
        }

        // 2. Bearer token formatini tekshirish
        const bearer = auth.split(' ')[0];     // "Bearer" so‘zi
        const authToken = auth.split(' ')[1];  // Tokenning o‘zi

        if (bearer !== 'Bearer' || !authToken) {
            throw new AppError('Unauthorized', 401);  // Format noto‘g‘ri bo‘lsa
        }

        // 3. Tokenni verify qilish
        const user = token.verifyToken(authToken, config.TOKEN.ACCESS_KEY); // Tokenni tekshirish

        // Agar token to‘g‘ri bo‘lsa, foydalanuvchi ma’lumotini requestga biriktiramiz
        req.user = user;

        // 4. Keyingi middleware yoki controllerga o‘tkazamiz
        next();
    } catch (error) {
        // Token noto‘g‘ri bo‘lsa yoki muddati tugagan bo‘lsa
        next(error);
    }
}