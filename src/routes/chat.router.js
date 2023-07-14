import { Router } from 'express';
import {renderChat, saveMessages} from '../controller/chat.js';

const router = Router();

router.get('/', renderChat);

router.post('/', saveMessages);

export default router;
