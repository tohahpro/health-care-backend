import express, { NextFunction, Request, Response } from 'express'
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.get("/me", AuthController.getMe)
router.post('/refresh-token', AuthController.refreshToken)
router.post('/change-password', auth(UserRole.Admin, UserRole.Doctor, UserRole.Patient), AuthController.changePassword);
router.post('/forgot-password', AuthController.forgotPassword);
router.post(
    '/reset-password',
    (req: Request, res: Response, next: NextFunction) => {
        //user is resetting password without token and logged in newly created admin or doctor
        if (!req.headers.authorization && req.cookies.accessToken) {
            auth(UserRole.Admin, UserRole.Doctor, UserRole.Patient)(req, res, next);
        } else {
            //user is resetting password via email link with token
            next();
        }
    },
    AuthController.resetPassword
)

export const AuthRoutes = router