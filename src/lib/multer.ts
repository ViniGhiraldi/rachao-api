import multer from "fastify-multer";
import path from "path";
import crypto from "crypto";

const upload = multer({
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if(err) cb(err, file.originalname);

                const filename = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, filename);
            })
        }
    }),
    limits: {
        fileSize: 3 * 1024 * 1024, //3MB
        files: 9
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png'
        ];

        if (allowedMimes.includes(file.mimetype)){
            cb(null, true);
        } else{
            cb(new Error('Invalid file type.'))
        }
    }
})

export default upload;