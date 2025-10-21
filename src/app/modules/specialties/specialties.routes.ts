import express, { NextFunction, Request, Response } from 'express';
import { SpecialtiesController } from './specialties.controller';
import { fileUploader } from '../../helper/fileUploader';
import { SpecialtiesValidation } from './specialties.validation';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';


const router = express.Router();

router.post('/', fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialtiesValidation.create.parse(JSON.parse(req.body.data))
        return SpecialtiesController.insertSpecialtiesIntoDB(req, res, next)
    });

router.get('/', SpecialtiesController.getAllSpecialties);
router.delete('/:id', auth(UserRole.Admin), SpecialtiesController.deleteSpecialties);


export const SpecialtiesRoutes = router;