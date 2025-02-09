import { Request, Response } from "express";
import { UserRepository } from "../repository/userRepository";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { auditLogger } from "../utils/auditLogger";
import { User } from "@ebuddy/shared";
import { auth } from "../config/firebaseConfig";

const userRepository = new UserRepository();
const isEmulator = process.env.USE_FIREBASE_EMULATOR === "true";

export class UserController {
    static async fetchAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await userRepository.getAllUsers();

            if (users.length === 0) {
                res.status(404).json(errorResponse("No users found", 404));
                return;
            }

            await auditLogger("SYSTEM", "FETCH_ALL_USERS", {});

            res.json(successResponse("All users fetched successfully", users));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch users";
            res.status(500).json(errorResponse(errorMessage));
        }
    }

    static async fetchUserData(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json(errorResponse("User ID is required", 400));
                return;
            }

            const user = await userRepository.getUserById(id);

            if (!user) {
                res.status(404).json(errorResponse("User not found", 404));
                return;
            }

            await auditLogger(id, "FETCH_USER_DATA", {});

            res.json(successResponse("User data fetched successfully", user));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Server error";
            res.status(500).json(errorResponse(errorMessage));
        }
    }

    static async addUser(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, totalAverageWeightRatings, numberOfRents, recentlyActive } = req.body;

            if (!name || !email || totalAverageWeightRatings === undefined || numberOfRents === undefined || recentlyActive === undefined) {
                res.status(400).json(errorResponse("Missing required fields", 400));
                return;
            }

            const userId = await userRepository.addUser({
                name,
                email,
                totalAverageWeightRatings,
                numberOfRents,
                recentlyActive,
            });

            await auditLogger(userId, "ADD_USER", { email });

            res.json(successResponse("User added successfully", { id: userId }));
        } catch (error: any) {
            console.error("❌ Error adding user:", error);
            res.status(500).json(errorResponse(error.message));
        }
    }

    static async updateUserData(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!id) {
                res.status(400).json(errorResponse("User ID is required", 400));
                return;
            }

            const updated = await userRepository.updateUser(id, updateData);
            if (!updated) {
                res.status(404).json(errorResponse("User not found"));
                return;
            }

            await auditLogger(id, "UPDATE_USER_DATA", updateData);

            res.json(successResponse("User updated successfully"));
        } catch (error: any) {
            console.error("❌ Error updating user:", error);
            res.status(500).json(errorResponse(error.message));
        }
    }

    static async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json(errorResponse("User ID is required", 400));
                return;
            }

            const loggedInUserId = (req as any).user?.uid;

            if (id === loggedInUserId) {
                res.status(403).json(errorResponse("You cannot delete your own account", 403));
                return;
            }

            const deleted = await userRepository.deleteUser(id);
            if (!deleted) {
                res.status(404).json(errorResponse("User not found"));
                return;
            }

            await auditLogger(id, "DELETE_USER", {});

            res.json(successResponse("User deleted successfully"));
        } catch (error: any) {
            console.error("❌ Error deleting user:", error);
            res.status(500).json(errorResponse(error.message));
        }
    }

}
