import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types";
import { pick } from "../../helper/pick";



const createAppointment = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await AppointmentService.createAppointment(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Appointment created successfully!",
        data: result
    })
});

const getMyAppointments = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
    const filters = pick(req.query, ["status", "paymentStatus"])

    const user = req.user;
    const result = await AppointmentService.getMyAppointments(user as IJWTPayload, filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched my appointments successfully!",
        meta: result.meta,
        data: result.data   
    })
});

export const AppointmentController = {
    createAppointment,
    getMyAppointments,
}