import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { MetaService } from "./meta.service";
import { IJWTPayload } from "../../types";

const fetchDashboardMetaData = catchAsync(async (req: Request &{user?: IJWTPayload}, res: Response) => {
    const user = req.user;
    const result = await MetaService.fetchDashboardMetaData(user as IJWTPayload)

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Meta data retrieved successfully!",
        data: result
    })
});



export const MetaController = {
    fetchDashboardMetaData,
}