import { HandleUserSignup, HandleUserLogin , UpdateUserProfile} from '../controllers/user.js';

import express from 'express';
const router = express.Router();

router.post('/',HandleUserSignup);
router.post('/login', HandleUserLogin);
router.post('/update-profile', UpdateUserProfile)

export default router;
