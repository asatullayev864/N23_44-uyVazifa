import { extname, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import multer from 'multer';
import { v4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = join(__dirname, '../../uploads');

if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = extname(file.originalname);
        const fileName = `${v4()}_${file.originalname}`;
        cb(null, fileName);
    }
});

export const uploadFile = multer({ storage });
