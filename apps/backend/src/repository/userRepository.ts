import { firestore, auth } from "../config/firebaseConfig";
import { User } from "@ebuddy/shared";

const USERS_COLLECTION = "USERS";

export class UserRepository {
    async getUserById(userId: string): Promise<User | null> {
        try {
            const userDoc = await firestore.collection(USERS_COLLECTION).doc(userId).get();
            if (!userDoc.exists) {
                return null;
            }

            const userData = userDoc.data() as User;

            try {
                const userRecord = await auth.getUser(userId);
                userData.name = userRecord.displayName || userData.name;
                userData.email = userRecord.email || userData.email;
            } catch (error) {
                console.warn(`⚠️ Firebase Auth user not found for ID: ${userId}, using Firestore data.`);
            }

            return userData;
        } catch (error) {
            console.error("❌ Error fetching user:", error);
            return null;
        }
    }

    async getAllUsers(): Promise<User[]> {
        try {
            const usersSnapshot = await firestore.collection(USERS_COLLECTION).get();
            if (usersSnapshot.empty) {
                return [];
            }

            return usersSnapshot.docs.map(doc => doc.data() as User);
        } catch (error) {
            console.error("❌ Error fetching all users:", error);
            return [];
        }
    }

    async addUser(userData: Omit<User, "id">): Promise<string> {
        let userRecord;
        try {
            userRecord = await auth.createUser({
                email: userData.email,
                password: "Default@1234",
                displayName: userData.name,
            });

            console.log(`✅ Created user in Firebase Auth: ${userRecord.uid}`);

            const userId = userRecord.uid;
            await firestore.collection(USERS_COLLECTION).doc(userId).set({
                id: userId,
                ...userData,
            });

            console.log(`✅ User created in Firestore: ${userId}`);
            return userId;
        } catch (error) {
            console.error("❌ Error creating user:", error);

            if (userRecord) {
                console.warn(`⚠️ Rolling back: Deleting user from Firebase Auth (${userRecord.uid})`);
                await auth.deleteUser(userRecord.uid);
            }

            throw new Error("Failed to create user");
        }
    }

    async updateUser(userId: string, userData: Partial<User>): Promise<boolean> {
        try {

            const userDoc = await firestore.collection(USERS_COLLECTION).doc(userId).get();
            if (!userDoc.exists) {
                console.warn(`⚠️ User ${userId} not found in Firestore. Skipping update.`);
                return false;
            }

            let userRecord;
            try {
                userRecord = await auth.getUser(userId);
            } catch (error) {
                console.warn(`⚠️ User ${userId} not found in Firebase Auth. Skipping Auth update.`);
                userRecord = null;
            }

            if (userRecord) {
                const authUpdates: { email?: string; displayName?: string } = {};
                if (userData.email) authUpdates.email = userData.email;
                if (userData.name) authUpdates.displayName = userData.name;

                if (Object.keys(authUpdates).length > 0) {
                    await auth.updateUser(userId, authUpdates);
                    console.log(`✅ Updated user in Firebase Auth: ${userId}`);
                }
            }

            await firestore.collection(USERS_COLLECTION).doc(userId).update(userData);
            console.log(`✅ Updated user in Firestore: ${userId}`);

            return true;
        } catch (error) {
            console.error("❌ Error updating user:", error);
            return false;
        }
    }

    async deleteUser(userId: string): Promise<boolean> {
        try {

            const userDoc = await firestore.collection(USERS_COLLECTION).doc(userId).get();
            if (!userDoc.exists) {
                console.warn(`⚠️ User ${userId} not found in Firestore. Skipping delete.`);
                return false;
            }

            try {
                await auth.deleteUser(userId);
                console.log(`✅ Deleted user from Firebase Auth: ${userId}`);
            } catch (error: any) {
                console.warn(`⚠️ Could not delete user from Firebase Auth: ${error.message}`);
            }

            await firestore.collection(USERS_COLLECTION).doc(userId).delete();
            console.log(`✅ Deleted user from Firestore: ${userId}`);

            return true;
        } catch (error: any) {
            console.error("❌ Error deleting user:", error);
            return false;
        }
    }
}
