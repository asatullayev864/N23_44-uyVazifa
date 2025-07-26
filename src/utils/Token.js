import jwt from 'jsonwebtoken';
import config from '../config/index.js';

class Token {
    generateAccessToken(payload) {
        return jwt.sign(payload, config.TOKEN.ACCESS_KEY, {
            expiresIn: config.TOKEN.ACCESS_TIME
        });
    }

    generateRefreshToken(payload) {
        return jwt.sign(payload, config.TOKEN.REFRESH_KEY, {
            expiresIn: config.TOKEN.REFRESH_TIME
        });
    }

    verifyToken(token, key) {
        try {
            return jwt.verify(token, key);
        } catch (error) {
            console.log('JWT Verify error:', error.message);
            return null;
        }
    }
}

export default new Token();
