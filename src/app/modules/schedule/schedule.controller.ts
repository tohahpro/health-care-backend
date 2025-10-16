import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import { pick } from "../../helper/pick";


const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule created successfully!",
        data: result
    })
});

const schedulesForDoctor = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
    const filters = pick(req.query, ["startDateTime", "endDateTime"])
    
    const result = await ScheduleService.schedulesForDoctor(options, filters);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule retrieved successfully!",
        data: result
    })
});

export const ScheduleController = {
    insertIntoDB,
    schedulesForDoctor,

}