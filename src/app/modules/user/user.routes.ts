import express, { NextFunction, Request, Response } from 'express'
import { UserController } from './user.controller';
import { fileUploader } from '../../helper/fileUploader';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get('/', UserController.getAllFromDB)

router.post(
    '/create-patient',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction)=>{
        req.body = UserValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createPatient(req, res, next)
    },
   
)

router.post(
    "/create-admin",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createAdmin(req, res, next)
    }
);

router.post(
    "/create-doctor",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {        
        req.body = UserValidation.createDoctorValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createDoctor(req, res, next)
    }
);

export const userRoutes = router