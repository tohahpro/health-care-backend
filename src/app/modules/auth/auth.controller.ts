import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import { AuthService } from "./auth.service"
import sendResponse from "../../shared/sendResponse"

const login = catchAsync(async (req: Request, res: Response)=>{
    
    const result = await AuthService.login(req.body)
    const {accessToken, refreshToken, needPasswordChange} = result

    res.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none"
    })
    res.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 80
    })

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User Login successfully",
        data: result
    })
})


export const AuthController = {
    login,
}