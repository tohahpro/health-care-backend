import httpStatus from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types";
import { PrescriptionService } from "./prescription..service";
import { pick } from "../../helper/pick";



const createPrescription = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {

    const user = req.user;
    const result = await PrescriptionService.createPrescription(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Prescription created successfully!",
        data: result
    })
});

const getPrescriptions = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

    const result = await PrescriptionService.getPrescriptions(user as IJWTPayload, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Prescriptions retrieved successfully!",
        meta: result.meta,
        data: result.data
    })
});


export const PrescriptionController = {
    createPrescription,
    getPrescriptions,
}