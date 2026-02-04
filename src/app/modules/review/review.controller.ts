import httpStatus from 'http-status';
import { Request, Response } from "express"
import { ReviewService } from "./review.service"
import { IJWTPayload } from "../../types";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { pick } from '../../helper/pick';
import { reviewFilterableFields } from './review.contant';


const insertIntoDB = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    
    const user = req.user;
    const result = await ReviewService.insertIntoDB(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Review created successfully!",
        data: result
    })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, reviewFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await ReviewService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reviews retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getSingleFromDB = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await ReviewService.getSingleFromDB(userId, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reviews retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});


export const ReviewController = {
    insertIntoDB,
    getSingleFromDB,
    getAllFromDB
}