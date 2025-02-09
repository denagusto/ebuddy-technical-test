import express from "express";
import { UserController } from "../../controller/userController";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/fetch-all-users", authMiddleware, UserController.fetchAllUsers);
router.post("/create-user-data", authMiddleware, UserController.addUser);
router.get("/fetch-user-data/:id", authMiddleware, UserController.fetchUserData);
router.put("/update-user-data/:id", authMiddleware, UserController.updateUserData);
router.delete("/delete-user-data/:id", authMiddleware, UserController.deleteUser);

export default router;
