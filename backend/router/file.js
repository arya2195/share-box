import express from 'express';
import { uploadFile } from '../controller/file.js';
import multer from 'multer';
const router = express.Router();
const upload = multer();
router.post('/upload', upload.single('file'), uploadFile);
//router.delete('/delete/:key', deleteFile);
//router.get('/file/:key', getFile);
export default router;