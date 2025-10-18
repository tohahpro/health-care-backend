import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { IJWTPayload } from "../../types";


const createDoctorSchedule = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user
    const result = await DoctorScheduleService.createDoctorSchedule(user as IJWTPayload, req.body)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Schedule created successfully!",
        data: result
    })
});



export const DoctorScheduleController = {
    createDoctorSchedule,

}