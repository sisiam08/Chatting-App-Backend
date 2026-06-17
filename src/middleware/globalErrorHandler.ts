import { Request, Response, NextFunction } from "express";

import { IErrorSource } from "../interfaces";
import { deleteFileFromCloudinary } from "../config/cloudinary.config";
import status from "http-status";
import {
  handlePrismaError,
  handlePrismaInitializationError,
  handlePrismaValidationError,
} from "../errors/prismaErrors";
import { Prisma } from "../generated/prisma/client";
import { isAppError } from "../errors/appError";

export const globalErrorHandler = async (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong!";
  let errorSource: IErrorSource[] = [];

  // Store original error for logging in development
  const isDevelopment = process.env.NODE_ENV === "development";
  const stack = isDevelopment ? (err as Error).stack : undefined;

  // Log full error for debugging
  if (isDevelopment) {
    console.error("[GlobalErrorHandler] Error:", {
      message: err instanceof Error ? err.message : String(err),
      code: (err as any).code,
      statusCode: (err as any).statusCode,
      path: req.path,
      method: req.method,
      stack: stack,
    });
  }

  if (req.file) {
    await deleteFileFromCloudinary(req.file.path);
  }

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files.map((file: Express.Multer.File) => file.path);
    await Promise.all(imageUrls.map((url) => deleteFileFromCloudinary(url)));
  }

  // Handle Prisma Known Request Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const {
      statusCode: code,
      message: msg,
      errorSource: source,
    } = handlePrismaError(err);
    statusCode = code;
    message = msg;
    errorSource = source;
  }
  // Handle Prisma Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    const {
      statusCode: code,
      message: msg,
      errorSource: source,
    } = handlePrismaValidationError(err);
    statusCode = code;
    message = msg;
    errorSource = source;
  }
  // Handle Prisma Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    const {
      statusCode: code,
      message: msg,
      errorSource: source,
    } = handlePrismaInitializationError(err);
    statusCode = code;
    message = msg;
    errorSource = source;
  }
  // Handle Custom AppError
  else if (isAppError(err)) {
    statusCode = err.statusCode;
    message = err.message;
    errorSource = [
      {
        path: "application",
        message: err.message,
      },
    ];
  }
  // Handle Generic Error
  else if (err instanceof Error) {
    message = err.message;
    errorSource = [
      {
        path: "application",
        message: err.message,
      },
    ];
  }

  const response: any = {
    success: false,
    message,
    errorSource,
  };

  // Only include stack in development
  if (process.env.NODE_ENV === "development") {
    response.statusCode = statusCode;
    response.stack = stack;
  }

  res.status(statusCode).json(response);
};
