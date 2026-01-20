import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import { pick } from "../../helper/pick";
import { IJWTPayload } from "../../types";
import httpStatus from "http-status";


const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule created successfully!",
        data: result
    })
});

const schedulesForDoctor = catchAsync(async (req: Request & {user?: IJWTPayload}, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
    const filters = pick(req.query, ["startDateTime", "endDateTime"])
    const user = req.user;
    const result = await ScheduleService.schedulesForDoctor(user as IJWTPayload,options, filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule retrieved successfully!",
        meta: result.meta,
        data: result.data
    })
});

const getScheduleById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ScheduleService.getScheduleById(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Schedule retrieval successfully',
        data: result,
    });
});

const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response) => {
    const scheduleId = req.params.id;
    
    const result = await ScheduleService.deleteScheduleFromDB(scheduleId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule deleted successfully!",
        data: result
    })
});

export const ScheduleController = {
    insertIntoDB,
    schedulesForDoctor,
    getScheduleById,
    deleteScheduleFromDB,

}