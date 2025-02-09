import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const isEmulator = process.env.USE_FIREBASE_EMULATOR === "true";
const projectId = process.env.FIREBASE_PROJECT_ID || "demo-project";

const serviceAccountPath = process.env.FIREBASE_CREDENTIAL_PATH;
if (!isEmulator && !serviceAccountPath) {
    throw new Error("❌ ERROR: FIREBASE_CREDENTIAL_PATH is required in production mode.");
}

let serviceAccount = null;
if (!isEmulator && serviceAccountPath) {
    try {
        serviceAccount = require(path.resolve(__dirname, "../../", serviceAccountPath));
    } catch (error) {
        throw new Error(`❌ ERROR: Cannot load Firebase credentials from ${serviceAccountPath}. Make sure the file exists.`);
    }
}

if (isEmulator) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
    console.log(`🔥 Firebase Auth Emulator set to: ${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: isEmulator ? admin.credential.applicationDefault() : admin.credential.cert(serviceAccount as admin.ServiceAccount),
        projectId,
    });
}

export const firestore = admin.firestore();
export const auth = admin.auth();

if (isEmulator) {
    console.log(`🔥 Using Firebase Emulator with Project ID: ${projectId}`);
    firestore.settings({ host: "localhost:8080", ssl: false });
}

async function ensureCollections() {
    try {
        const usersCollection = firestore.collection("USERS");
        const auditLogsCollection = firestore.collection("AUDIT_LOGS");

        const logsSnapshot = await auditLogsCollection.get();
        if (logsSnapshot.empty) {
            console.log("⚡ Creating initial AUDIT_LOGS collection...");

            const logRef = auditLogsCollection.doc();
            await logRef.set({
                id: logRef.id,
                userId: "system",
                action: "INIT_FIRESTORE",
                timestamp: Date.now(),
                details: "Initialized USERS & AUDIT_LOGS collections",
            });

            console.log("✅ AUDIT_LOGS collection initialized.");
        }
    } catch (error) {
        console.error("❌ Error initializing Firestore collections:", error);
    }
}


ensureCollections();

async function createTestUser() {
    try {
        const email = "denagus007@gmail.com";
        const password = "Admin12#";
        const displayName = "Agus Riyanto";

        let userRecord;

        try {
            userRecord = await auth.getUserByEmail(email);
            console.log(`✅ User already exists in Firebase Auth: ${userRecord.uid}`);
        } catch (error) {
            console.warn(`⚠️ User not found in Firebase Auth, creating...`);
            userRecord = await auth.createUser({
                email,
                password,
                displayName,
            });
            console.log(`✅ Created test user in Firebase Auth: ${userRecord.uid}`);
        }

        const userId = userRecord.uid;

        const userDoc = await firestore.collection("USERS").doc(userId).get();
        if (!userDoc.exists) {
            console.warn(`⚠️ User not found in Firestore, creating...`);
            await firestore.collection("USERS").doc(userId).set({
                id: userId,
                name: displayName,
                email,
                totalAverageWeightRatings: 5,
                numberOfRents: 0,
                recentlyActive: Date.now(),
            });
            console.log(`✅ User created in Firestore: ${userId}`);
        } else {
            console.log(`✅ User already exists in Firestore: ${userId}`);
        }

        await firestore.collection("AUDIT_LOGS").add({
            userId,
            action: "CREATE_USER",
            timestamp: Date.now(),
            details: "Test user created in Firebase Emulator",
        });

    } catch (error) {
        console.error("❌ Failed to create test user:", error);
    }
}

if (isEmulator) {
    createTestUser();
} else {
    console.log("🚀 Using Production Firebase Services");
}

