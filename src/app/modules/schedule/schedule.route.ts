import express from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", ScheduleController.insertIntoDB)
router.get("/", auth(UserRole.Doctor, UserRole.Admin), ScheduleController.schedulesForDoctor)
router.delete("/:id", ScheduleController.deleteScheduleFromDB)

export const ScheduleRoutes = router;