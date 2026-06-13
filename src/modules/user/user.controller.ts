import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { ISearchUser, IUpdateUserInfo } from "../../interfaces/user.type";

const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const result = await UserServices.getUserById(userId!);
    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve profile",
      data: null,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;

    const result = await UserServices.getUserById(userId);
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve user",
      data: null,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, cursor } = req.query;

    const search = { name, email, phone } as ISearchUser;

    const result = await UserServices.getAllUsers(search, cursor as string);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      data: null,
    });
  }
};

const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const updateData: IUpdateUserInfo = {};
    const { name, phone } = req.body;
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const result = await UserServices.updateUserInfo(userId!, updateData);

    res.status(200).json({
      success: true,
      message: "User info updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user info",
      data: null,
    });
  }
};

export const UserControllers = {
  getMyProfile,
  getUserById,
  getAllUsers,
  updateUserInfo,
};
