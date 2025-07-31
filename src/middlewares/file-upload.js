import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import multer from 'multer';
import { v4 } from 'uuid';

const uploadDir = join(__dirnamem, '../../uploads');

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

export const upload = multer({ storage });
