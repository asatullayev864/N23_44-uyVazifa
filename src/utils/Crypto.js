import { hash, compare } from "bcrypt";

// Crypto class - parollarni shifrlash va solishtirish uchun xizmat qiladi
class Crypto {
    // Parolni shifrlash
    async encrypt(data) {
        // 7 — bu "salt rounds", ya'ni shifrlash darajasi
        return await hash(data, 7);
    }

    // Parolni tekshirish (foydalanuvchi kiritgan parol vs. shifrlangan parol)
    async decrypt(data, encryptedData) {
        // data - foydalanuvchidan kelgan oddiy parol
        // encryptedData - bazadagi shifrlangan parol
        return compare(data, encryptedData);
    }
}

// Singleton obyekt sifatida eksport qilinmoqda
export default new Crypto();