import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { auditLogger } from "../utils/auditLogger";

export class AuthController {
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json(errorResponse("Email and password are required", 400));
                return;
            }

            const isEmulator = process.env.USE_FIREBASE_EMULATOR === "true";
            const auth = getAuth();

            try {
                const userRecord = await auth.getUserByEmail(email);

                if (isEmulator) {
                    console.log("🔥 Using Firebase Emulator - Generating Test Token");

                    const customToken = await auth.createCustomToken(userRecord.uid);

                    const emulatorResponse = await fetch(
                        "http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=fake-api-key",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                token: customToken,
                                returnSecureToken: true,
                            }),
                        }
                    );

                    const emulatorData = await emulatorResponse.json();

                    if (emulatorData.error) {
                        res.status(401).json(errorResponse("Emulator login failed"));
                        return;
                    }

                    res.json(successResponse("Login successful (Emulator)", { token: emulatorData.idToken }));
                    return;
                }
            } catch (error) {
                res.status(404).json(errorResponse("User not found", 404));
                return;
            }

            if (!isEmulator) {
                const firebaseApiKey = process.env.FIREBASE_API_KEY;
                if (!firebaseApiKey) {
                    res.status(500).json(errorResponse("Missing Firebase API Key in environment variables"));
                    return;
                }

                const response = await fetch(
                    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: email,
                            password: password,
                            returnSecureToken: true,
                        }),
                    }
                );

                const data = await response.json();

                if (data.error) {
                    res.status(401).json(errorResponse(data.error.message));
                    return;
                }

                res.json(successResponse("Login successful", { token: data.idToken }));
                return;
            }
        } catch (error: unknown) {
            console.error("❌ Login Error:", error);
            res.status(500).json(errorResponse("Internal server error"));
        }
    }
}
