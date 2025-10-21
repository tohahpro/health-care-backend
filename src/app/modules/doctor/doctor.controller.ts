import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DoctorService } from "./doctor.service";
import { pick } from "../../helper/pick";
import { doctorFilterableFields } from "./doctor.constant";


const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
    const filters = pick(req.query, doctorFilterableFields)

    const result = await DoctorService.getAllDoctors(options, filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Doctor retrieved successfully!",
        meta: result.meta,
        data: result.data
    })
});

export const DoctorController = {
    getAllDoctors
}