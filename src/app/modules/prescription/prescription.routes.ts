import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { PrescriptionController } from "./prescription.controller";


const router = require('express').Router();

router.post('/',auth(UserRole.Doctor), PrescriptionController.createPrescription);


export const prescriptionRoutes = router;