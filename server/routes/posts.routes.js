import {Router} from 'express'; 
import { activeCheck } from '../controllers/posts.controller.js';


const router = Router();   

router.get('/', activeCheck);

export default router;

