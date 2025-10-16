import express from "express";
import { ScheduleController } from "./schedule.controller";

const router = express.Router();

router.post("/", ScheduleController.insertIntoDB)
router.get("/", ScheduleController.schedulesForDoctor)


export const ScheduleRoutes = router;