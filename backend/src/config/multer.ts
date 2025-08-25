import multer = require('multer');
import path = require('path');

// Storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/receipts'); 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

// File filter and limits
export const uploadReceipt = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) cb(null, true);
    else cb(new Error('Only JPG, PNG, or PDF files are allowed'));
  },
});
