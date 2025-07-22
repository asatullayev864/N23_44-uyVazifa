import { hash, compare } from "bcrypt";

class Crypto {
    async encrypt(data) {
        return await hash(data, 7)
    }

    async decrypt(data, encryptedData) {
        return compare(data, encryptedData);
    }
}

export default new Crypto();