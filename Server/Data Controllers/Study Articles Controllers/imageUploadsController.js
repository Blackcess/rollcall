import path from 'path';
import { fileURLToPath } from 'url';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    // Return a fully qualified URL for convenience
    const protocol = req.protocol;
    const host = req.get('host'); // e.g., localhost:5000
    // const url = `${protocol}://${host}/uploads/${req.file.filename}`;
    const url = `/uploads/${req.file.filename}`;

    // Optionally: save metadata to uploads table (if you implement it later)

    res.json({ status: true, url, filename: req.file.filename });
  } catch (err) {
    console.error('uploadImage error', err);
    res.status(500).json({ status: false, message: 'Upload failed' });
  }
};
// const url = `/uploads/${req.file.filename}`;