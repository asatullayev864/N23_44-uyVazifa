// RolesGuard - rollarga asoslangan ruxsatni tekshiruvchi middleware

import { AppError } from "../error/AppError.js";

// Masalan: RolesGuard('admin', 'moderator') yoki RolesGuard('ID')
export const RolesGuard = (...roles) => {
    return async function (req, res, next) {
        try {
            /*
              1. Foydalanuvchi roli `req.user.role` ichida bo‘lishi kerak
                 YOKI
              2. Agar 'ID' rollardan biri bo‘lsa, va foydalanuvchi o‘ziga tegishli IDga murojaat qilayotgan bo‘lsa
            */
            if (
                (req.user?.role && roles.includes(req.user.role)) ||                        // Ruxsat etilgan rollardan biri
                (roles.includes('ID') && req.params?.id === req.user?.id)                  // Agar "ID" ruxsat berilgan bo‘lsa va foydalanuvchi o‘z IDsi bilan kelgan bo‘lsa
            ) {
                return next(); // Ruxsat berilgan, keyingi middlewarega o‘tamiz
            }

            // Aks holda, ruxsat yo‘q (Forbidden)
            throw new AppError('Forbidden user', 403); // Ruxsat etilmagan foydalanuvchi
        } catch (error) {
            // Xatolik yuz bersa, server xatosi bilan javob qaytaramiz
            next(error);
        }
    }
}