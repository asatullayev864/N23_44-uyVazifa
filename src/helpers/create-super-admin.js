// Admin modelini chaqirib olish
import Admin from '../models/admin.model.js';

// Parolni shifrlovchi util funksiyani chaqirish
import crypto from '../utils/Crypto.js';

// MongoDB bilan ulanish uchun funksiyalar
import { connectDB } from '../db/index.js';
import { disconnect } from 'mongoose';

// Konfiguratsiyadagi super admin ma'lumotlarini olish
import config from '../config/index.js';

// Asinxron IIFE (Immediately Invoked Function Expression) - darhol bajariladigan funksiyani ishga tushirish
(async function () {
    try {
        // 1. Bazaga ulanish
        await connectDB();

        // 2. Konfiguratsiyadagi parolni shifrlash
        const hashedPassword = await crypto.encrypt(config.SUPERADMIN.PASSWORD);

        // 3. Admin modeliga yangi super admin yaratish
        await Admin.create({
            name: config.SUPERADMIN.NAME,
            email: config.SUPERADMIN.EMAIL,
            password: hashedPassword,
            role: 'SUPERADMIN'
        });

        // 4. Muvaffaqiyatli yaratilgani haqida xabar
        console.log(`Super admin success created`);

        // 5. Bazadan uzilish
        await disconnect();
    } catch (error) {
        // Xatolik yuz bergan bo‘lsa, konsolga chiqarish
        console.log(`Error on creating super admin`, error);
    }
}());