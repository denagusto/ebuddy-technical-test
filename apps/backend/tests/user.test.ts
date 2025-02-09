import request from "supertest";
import app from "../src/core/app";

const testToken = "YOUR_FIREBASE_TEST_TOKEN";

describe("User API Tests", () => {
    it("should fetch user data", async () => {
        const res = await request(app)
            .get("/api/v1/fetch-user-data")
            .set("Authorization", `Bearer ${testToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("email");
    });

    it("should update user data", async () => {
        const res = await request(app)
            .post("/api/v1/update-user-data")
            .set("Authorization", `Bearer ${testToken}`)
            .send({ name: "Updated User" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
