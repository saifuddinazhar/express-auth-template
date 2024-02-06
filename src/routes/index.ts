import express from 'express';
import authRoute from './auth-route'
import homeController from '../controllers/home-controller';

const router = express.Router();

router.get('/', homeController.get);
router.use('/auth', authRoute);

export default router;
