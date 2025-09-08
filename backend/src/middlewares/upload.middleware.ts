import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Définir le stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname,"../uploads")); // dossier où stocker
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // ex: 1234567890.pdf
  },
});

// Limite taille (5MB)
const MAX_SIZE = 5 * 1024 * 1024;

// Filtrer les types de fichiers
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and PDF files are allowed'));
  }
};

// Middleware Multer
const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});

export default upload;
