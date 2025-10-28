import express from 'express';
const router = express.Router();
import { register , login} from '../controllers/auth.controller';

console.log('✅ Auth routes file loaded');

router.post('/register', register);
router.post('/login', login)


export default router;

