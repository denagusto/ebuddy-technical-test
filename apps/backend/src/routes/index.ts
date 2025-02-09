import express from "express";
import userRoutesV1 from "./v1/userRoutes";
import authRoutesV1 from "./v1/authRoutes";

const router = express.Router();

router.use("/v1", userRoutesV1);
router.use("/v1/auth", authRoutesV1);

export default router;
