import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/tmp");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 2MB limit
});


export default upload;
