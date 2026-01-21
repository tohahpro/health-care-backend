import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorScheduleService } from "./doctorSchedule.service";
import { IJWTPayload } from "../../types";
import { pick } from "../../helper/pick";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";
import { scheduleFilterableFields } from "./doctorSchedule.constants";


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

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, scheduleFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await DoctorScheduleService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Doctor Schedule retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getMySchedule = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const user = req.user;
    const result = await DoctorScheduleService.getMySchedule(filters, options, user as IJWTPayload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Schedule fetched successfully!",
        data: result
    });
});

const deleteFromDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {

    const user = req.user;
    const { id } = req.params;
    const result = await DoctorScheduleService.deleteFromDB(user as IAuthUser, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Schedule deleted successfully!",
        data: result
    });
});



export const DoctorScheduleController = {
    createDoctorSchedule,
    getAllFromDB,
    getMySchedule,
    deleteFromDB
}