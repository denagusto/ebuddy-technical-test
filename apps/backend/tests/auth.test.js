"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/core/app"));
const testToken = "YOUR_FIREBASE_TEST_TOKEN"; // Replace with a valid test token
const testUserId = "D1NQAWRWWDdUsIeMRCac"; // Replace with a valid Firestore user ID
describe("User API Tests", () => {
    it("should fetch user data by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/v1/fetch-user-data/${testUserId}`)
            .set("Authorization", `Bearer ${testToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty("email");
    }));
    it("should fetch all users", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/v1/fetch-all-users")
            .set("Authorization", `Bearer ${testToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    }));
    it("should create a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
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
    }));
    it("should update user data", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/v1/update-user-data/${testUserId}`)
            .set("Authorization", `Bearer ${testToken}`)
            .send({ name: "Agus Riyanto Updated" });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    }));
    it("should fail to update user with invalid ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put("/api/v1/update-user-data/invalidID123")
            .set("Authorization", `Bearer ${testToken}`)
            .send({ name: "Invalid Update" });
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    }));
    it("should delete a user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/v1/delete-user/${testUserId}`)
            .set("Authorization", `Bearer ${testToken}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    }));
    it("should fail to delete a user with invalid ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete("/api/v1/delete-user/invalidID123")
            .set("Authorization", `Bearer ${testToken}`);
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    }));
});
