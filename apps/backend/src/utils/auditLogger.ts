import { firestore } from "../config/firebaseConfig";

export const auditLogger = async (userId: string, action: string, details: object = {}) => {
    try {
        await firestore.collection("AUDIT_LOGS").add({
            userId,
            action,
            details,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error("Failed to log audit trail:", error);
    }
};
