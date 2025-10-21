import express from 'express';
import { DoctorController } from './doctor.controller';


const router = express.Router();

router.get('/', DoctorController.getAllDoctors)



export const DoctorRoutes = router;