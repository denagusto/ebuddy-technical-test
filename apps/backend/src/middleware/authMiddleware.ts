import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebaseConfig";

const isEmulator = process.env.USE_FIREBASE_EMULATOR === "true";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.error("❌ No token provided in request headers.");
            res.status(401).json({ error: "Unauthorized: No token provided" });
            return;
        }

        const token = authHeader.split(" ")[1];
        console.log("🔍 Received Token:", token);

        let decodedToken;
        if (isEmulator) {
            console.log("🔥 Using Firebase Emulator for token verification");

            process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

            try {
                decodedToken = await auth.verifyIdToken(token, true);
                console.log("✅ Token verified successfully in Firebase Emulator:", decodedToken.uid);
            } catch (error) {
                console.error("❌ Token verification failed in Emulator:", error);
                res.status(401).json({ error: "Invalid token in Firebase Emulator" });
                return;
            }
        } else {
            decodedToken = await auth.verifyIdToken(token);
            console.log("✅ Token verified successfully for user:", decodedToken.uid);
        }

        (req as any).user = decodedToken;
        next();
    } catch (error: unknown) {
        console.error("❌ Token verification failed:", error);

        const err = error as any;

        if (err.code === "auth/id-token-expired") {
            res.status(401).json({ error: "Token expired. Please log in again." });
        } else {
            res.status(401).json({ error: "Invalid token" });
        }
    }
};
