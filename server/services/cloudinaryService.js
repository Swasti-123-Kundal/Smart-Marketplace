import { cloudinary } from '../config/cloudinary.js';

/**
 * Upload a buffer to Cloudinary.
 * @param {Buffer} buffer - File buffer from Multer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<Object>} - { url, publicId }
 */
export const uploadToCloudinary = (buffer, folder = 'worksphere') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Delete an image from Cloudinary.
 * @param {string} publicId - Cloudinary public ID
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};
