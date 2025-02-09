import request from "supertest";
import app from "../src/core/app";

const testToken = "YOUR_FIREBASE_TEST_TOKEN";
const testUserId = "D1NQAWRWWDdUsIeMRCac";

describe("User API Tests", () => {
    it("should fetch user data by ID", async () => {
        const res = await request(app)
            .get(`/api/v1/fetch-user-data/${testUserId}`)
            .set("Authorization", `Bearer ${testToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("email");
    });

    it("should fetch all users", async () => {
        const res = await request(app)
            .get("/api/v1/fetch-all-users")
            .set("Authorization", `Bearer ${testToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should create a new user", async () => {
        const res = await request(app)
            .post("/api/v1/add-user")
            .set("Authorization", `Bearer ${testToken}`)
            .send({
                name: "Agus Riyanto",
                email: "denagus007@gmail.com",
                totalAverageWeightRatings: 4.5,
                numberOfRents: 30,
                recentlyActive: 1738938812
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("id");
    });

    it("should update user data", async () => {
        const res = await request(app)
            .put(`/api/v1/update-user-data/${testUserId}`)
            .set("Authorization", `Bearer ${testToken}`)
            .send({ name: "Agus Riyanto Updated" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("should fail to update user with invalid ID", async () => {
        const res = await request(app)
            .put("/api/v1/update-user-data/invalidID123")
            .set("Authorization", `Bearer ${testToken}`)
            .send({ name: "Invalid Update" });

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it("should delete a user", async () => {
        const res = await request(app)
            .delete(`/api/v1/delete-user/${testUserId}`)
            .set("Authorization", `Bearer ${testToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("should fail to delete a user with invalid ID", async () => {
        const res = await request(app)
            .delete("/api/v1/delete-user/invalidID123")
            .set("Authorization", `Bearer ${testToken}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});
