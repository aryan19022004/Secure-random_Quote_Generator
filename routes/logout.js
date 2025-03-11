import express from 'express'
const router = express.Router();
import {LogOut} from '../controllers/user.js'


router.get('/',LogOut);

export default router;
