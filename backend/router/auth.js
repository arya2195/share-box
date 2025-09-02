import express from 'express';
import { login, signup, logout } from '../controller/auth.js'
import { profile } from '../controller/user.js';
const app = express();
const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/me', profile);
router.post('/logout', logout);
export default router;