import multer from 'multer';
import ApiError from '../utils/ApiError.js';

// Use memory storage for Cloudinary upload
const storage = multer.memoryStorage();

// File filter — only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest('Only JPEG, PNG, WebP, and GIF images are allowed'), false);
  }
};

// Single image upload (5MB max)
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single('image');

// Multiple images upload (5 max, 5MB each)
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).array('images', 5);
