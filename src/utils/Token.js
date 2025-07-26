import jwt from 'jsonwebtoken'; // JWT kutubxonasi
import config from '../config/index.js'; // Konfiguratsiyadagi kalitlar va vaqtlar

// Token class - JWT tokenlar bilan ishlovchi util class
class Token {
    // Access token yaratish (odatda 15 min - 1 soat amal qiladi)
    generateAccessToken(payload) {
        return jwt.sign(payload, config.TOKEN.ACCESS_KEY, {
            expiresIn: config.TOKEN.ACCESS_TIME // token muddati (masalan: '1h')
        });
    }

    // Refresh token yaratish (uzoqroq muddatli, masalan 7 kun)
    generateRefreshToken(payload) {
        return jwt.sign(payload, config.TOKEN.REFRESH_KEY, {
            expiresIn: config.TOKEN.REFRESH_TIME // masalan: '7d'
        });
    }

    // JWT tokenni tekshirish (verify qilish)
    verifyToken(token, key) {
        try {
            return jwt.verify(token, key); // Token yaroqli bo‘lsa, payload qaytaradi
        } catch (error) {
            console.log('JWT Verify error:', error.message); // Token yaroqsiz bo‘lsa, logga yoziladi
            return null; // Yaroqsiz token bo‘lsa, null qaytariladi
        }
    }
}

// Singleton holatda eksport qilinmoqda
export default new Token();