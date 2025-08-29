import express from 'express';
import {login,signup} from '../controller/auth.js'
import { profile } from '../controller/user.js';
const app = express();
const router = express.Router();

router.post('/login',login);
router.post('/signup', signup);
router.get('/me',profile);
export default router;