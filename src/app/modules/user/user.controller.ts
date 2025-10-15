import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import { pick } from "../../helper/pick";

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createPatient(req)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Patient created successfully",
        data: result
    })
})

const createAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createAdmin(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createDoctor(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Created successful!",
        data: result
    })
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ["status", "role", "email", "searchValue"])
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
   
    const result = await UserService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Data retrieved successfully",
        meta: result.meta,
        data: result.data
    })
})

export const UserController = {
    createPatient,
    createAdmin,
    createDoctor,
    getAllFromDB

}