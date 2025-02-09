import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "../routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "*";

app.use(cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    next();
});

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use("/api", routes);

console.log(`🚀 Allowed CORS Origin: ${FRONTEND_URL}`);

export default app;
